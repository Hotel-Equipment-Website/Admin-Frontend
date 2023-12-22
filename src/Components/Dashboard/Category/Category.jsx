import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Category.scss'
import { AiFillPlusSquare, AiFillCloseCircle } from 'react-icons/ai'
import instance from '../../../utility/AxiosInstance';
import CatagoryAdd from './CategoryAdd/CategoryAdd'
import Navigation from '../../Navigation/Navigation';

export default function Category() {

    const [catageryData, setCatageryData] = useState([]);

    const navigation = useNavigate();

    const [displayCategoryAdd, setDisplayCategoryAdd] = useState(false);

    const [trigger, setTrigger] = useState(false);

    const [showCardView, setShowCardView] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [showCategoryUpdate, setShowCategoryUpdate] = useState(false);

    const [categoryName, setCategoryName] = useState("");

    const [categoryImage, setCategoryImage] = useState(null);


    function showCode() {
        setDisplayCategoryAdd(true);
    }

    const handleViewCategory = (category) => {
        setSelectedCategory(category);
        setShowCardView(true);
    }

    const handleCloseCardView = () => {
        setSelectedCategory(null);
        setShowCardView(false);
    }

    const handleUpdate = (category) => {
        setCategoryName(category.category_name);
        setSelectedCategory(category);
        setShowCategoryUpdate(true);
    }

    const handleCloseUpdate = () => {
        setSelectedCategory(null);
        setShowCategoryUpdate(false);
    }

    useEffect(() => {
        const chckAuth = async () => {
            // get token from local storage
            const token = await localStorage.getItem('loginToken');
            // console.log(token);

            // create authentication header
            const config = {
                headers: {
                    'Authorization': token
                }
            };

            instance.get('/auth', config).then((res) => {
                // console.log('', res.status);
            }).catch((err) => {
                // console.log(err.response.status);
                if (err.response.status === 401) return navigation('/auth')
            })

        }
        chckAuth();
    }, [])

    useEffect(() => {
        instance.get("/categories")
            .then(res => {
                if (res.data !== "No data found") {
                    setCatageryData(res.data)
                    // console.log(catageryData)
                }
                else console.log("No data found");
            }).catch(err => console.log(err))
    }, [trigger])



    const handleDeleteCategory = (category) => {
        // Display a confirmation dialog
        const confirmDelete = window.confirm(`Are you sure you want to delete the category "${category.category_name}?"`);

        const chckAuth = async () => {
            // get token from local storage
            const token = await localStorage.getItem('loginToken');
            // console.log(token);

            // create authentication header
            const config = {
                headers: {
                    'Authorization': token
                }
            };

            if (confirmDelete) {
                try {
                    await instance.delete(`/category/${category.category_id}`, config);
                    // After successful deletion, refetch categories
                    setTrigger(!trigger);

                } catch (error) {
                    console.error("Error deleting category: ", error);
                }
            }

        }
        chckAuth();
    };

    useEffect(() => {
        if (catageryData) {
            setCategoryName(catageryData.category_name);
        }
    }, [catageryData]);

    const handleCategoryNameChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setCategoryImage(selectedImage);
    };

    const submit = async (e) => {
        e.preventDefault();

        const token = await localStorage.getItem('loginToken');
        // console.log(token);

        // create authentication header
        const config = {
            headers: {
                'Authorization': token
            }
        };

        // Prepare form data
        const formData = new FormData();
        formData.append('category_name', categoryName);
        if (categoryImage) {
            formData.append('images', categoryImage);
        }

        try {
            // Make PATCH request to update category
            await instance.patch(`/category/${selectedCategory.category_id}`, formData, config);

            // Close the update popup
            setShowCategoryUpdate(false);
            setTrigger(!trigger);

        } catch (error) {
            console.error("Error updating category: ", error);
        }
    };

    return (
        <>
            <Navigation />

            <div className='category-container'>
                {displayCategoryAdd ? <CatagoryAdd setDisplayCategoryAdd={setDisplayCategoryAdd} setTrigger={setTrigger} /> : null}
                <div className="head">
                    <div className="name"><h2>Category</h2></div>
                    <AiFillPlusSquare fontSize={50} className='icon' onClick={showCode} />
                </div>
                <div className='body'>
                    {
                        catageryData.map((data, index) => {
                            return (
                                <div className="card-fram" key={index}>
                                    <div className="image-container"><img src={`http://localhost:3001/image/${data.image}`} alt="" /></div>
                                    <div className="nameOfCard"><h3>{data.category_name}</h3></div>
                                    <div className="crud-function">
                                        <div className="list-view">
                                            <Link to={`/item/${data.category_id}/${data.category_name}`}>
                                                <button className="list-view-btn">
                                                    <h4>Add Items</h4>
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="crud-btns">
                                            <div className="top">
                                                <div className="view-btn" onClick={() => handleViewCategory(data)}>View Category</div>
                                            </div>
                                            <div className="bottom">
                                                <div className="update" onClick={() => { handleUpdate(data) }} setTrigger={setTrigger}>Update</div>
                                                <div className="delete" onClick={() => { handleDeleteCategory(data); }} setTrigger={setTrigger}>Delete</div>
                                            </div>
                                        </div>
                                    </div>

                                    {showCardView && selectedCategory && selectedCategory.category_id === data.category_id && (
                                        <div className='cardView-container'>
                                            <div className="cardView">
                                                <div className="close-icon"><AiFillCloseCircle size={25} color='red' className='icon' onClick={handleCloseCardView} /></div>
                                                <div className="card-section">
                                                    <div className="view-card-fram">
                                                        <div className="image-section">
                                                            <img src={`http://localhost:3001/image/${selectedCategory.image}`} alt="" />
                                                        </div>
                                                        <div className="name-section">
                                                            <h3>{selectedCategory.category_name}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {showCategoryUpdate && selectedCategory && selectedCategory.category_id === data.category_id && (
                                        <div className='categoryUpdate-container'>
                                            <div className="card-container">
                                                <div className="header">
                                                    <h4>{selectedCategory.category_name}</h4>
                                                </div>
                                                <form onSubmit={submit}>
                                                    <div className="input-section">
                                                        <div className="input-wrapper">
                                                            <input type="text" name="category-name" placeholder='Enter the Category Name' className='category-name' required
                                                                id='CategoryName'
                                                                value={categoryName}
                                                                onChange={handleCategoryNameChange} />
                                                            <div className="image-holder"><input type="file" id='UpdateImage' onChange={handleImageChange} required /></div>
                                                        </div>
                                                    </div>
                                                    <div className="submission-btn">
                                                        <input className="submit-btn" type="submit" value={"Update"} />
                                                        <div className="cancel-btn" onClick={handleCloseUpdate}>Cancel</div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}
