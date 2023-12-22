import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Item.scss'
import { useParams } from 'react-router-dom';
import instance from '../../../utility/AxiosInstance';
import { AiFillPlusSquare, AiFillCloseCircle } from 'react-icons/ai'
import ItemAdd from './ItemAdd/ItemAdd';
import Navigation from '../../Navigation/Navigation';

export default function Item() {


    const [itemData, setItemData] = useState([]);

    // const [id, setId] = useState();

    const [displayItemAdd, setDisplayItemAdd] = useState(false);

    const navigation = useNavigate();

    const [trigger, setTrigger] = useState(false);

    const { category_id, category_name } = useParams();

    const [showItemView, setShowItemView] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const [showUpdateWindow, setShowUpdateWindow] = useState(false);

    const [itemImage, setItemImage] = useState(null);

    const [itemName, setItemName] = useState("");

    const [brandName, setBrandName] = useState("");

    const [description, setDescription] = useState("");

    const [catID, setCatID] = useState(-999)

    // console.log(category_id);

    const showCode = async (id) => {
        setDisplayItemAdd(true);
        setCatID(id)
    }

    const itemView = (item) => {
        setSelectedItem(item);
        setShowItemView(true);
    }

    const closeItemView = () => {
        setSelectedItem(null);
        setShowItemView(false);
    }

    const handleUpdate = (item) => {
        setItemName(item.item_name)
        setBrandName(item.brand)
        setDescription(item.description)
        setSelectedItem(item);
        setShowUpdateWindow(true);
    }

    const handleCloseUpdate = () => {
        setSelectedItem(null);
        setShowUpdateWindow(false);
    }

    const handleItemNameChange = (e) => {
        setItemName(e.target.value);
    };

    const handleBrandChange = (e) => {
        setBrandName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setItemImage(selectedImage);
    };

    //Check The Login and set the Item Data in to the Fucntion
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
        instance.get(`/category/${category_id}/items`)
            .then(res => {
                if (res.data !== "No data found") {
                    setItemData(res.data)
                    // console.log(category_id, itemData)
                }
                else console.log("No data found");
            }).catch(err => console.log(err))
    }, [trigger])


    const handleDeleteItem = (item) => {
        // Display a confirmation dialog
        const confirmDelete = window.confirm(`Are you sure you want to delete the category "${item.item_name}?"`);

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
                    await instance.delete(`/item/${item.item_id}`, config);
                    // After successful deletion, refetch categories
                    setTrigger(!trigger);

                } catch (error) {
                    console.error("Error deleting category: ", error);
                }
            }

        }
        chckAuth();
    };


    //Update the Item
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
        formData.append('category_id', category_id);
        formData.append('item_name', itemName);
        formData.append('brand', brandName);
        formData.append('description', description);
        formData.append('model_number', " ");
        if (itemImage) {
            formData.append('images', itemImage);
        }

        try {
            // Make PATCH request to update category
            await instance.patch(`/items/${selectedItem.item_id}`, formData, config);

            // Close the update popup
            setShowUpdateWindow(false);
            setTrigger(!trigger);

        } catch (error) {
            console.error("Error updating Item: ", error);
        }
    };

    return (
        <>
            <Navigation />
            <div className='item-container'>
                {/* {displayItemAdd ? <ItemAdd setDisplayItemAdd={setDisplayItemAdd} setTrigger={setTrigger} /> : null} */}
                {displayItemAdd && catID !== -999 ? <ItemAdd setDisplayItemAdd={setDisplayItemAdd} setTrigger={setTrigger} catID={catID} setCatID={setCatID} /> : null}
                <div className="head">
                    <div className="name"><h2>{category_name}</h2></div>
                    <AiFillPlusSquare fontSize={50} className='icon' onClick={() => showCode(category_id)} />
                </div>
                <div className='body'>
                    {
                        itemData && itemData.map((data, index) => {
                            return (
                                <div className="card-fram" key={index}>

                                    <div className="image-container"><img src={`http://localhost:3001/image/${data.image}`} alt="" /></div>
                                    {/* <div className="image-container"><img src={img} alt="" /></div> */}
                                    <div className="nameOfCard"><h3>{data.item_name}</h3></div>
                                    <div className="crud-function">
                                        <div className="crud-btns">
                                            <div className="top">
                                                <div className="view-btn" onClick={() => itemView(data)}>View Item</div>
                                            </div>
                                            <div className="bottom">
                                                <div className="update" onClick={() => { handleUpdate(data) }}>Update</div>
                                                <div className="delete" onClick={() => { handleDeleteItem(data) }} setTrigger={setTrigger}>Delete</div>
                                            </div>
                                        </div>
                                    </div>

                                    {showItemView && selectedItem && selectedItem.item_id === data.item_id && (
                                        <div className='description-contaier'>
                                            <div className="card-container">
                                                <div className="maindetail">
                                                    <div className="left-img">
                                                        <img src={`http://localhost:3001/image/${selectedItem.image}`} alt="item" />
                                                    </div>
                                                    <div className="right-descriptino">
                                                        <div className="main-detailTag">
                                                            <div className="catagoryName"><p>Catagory Name : {category_name}</p></div>
                                                            <div className="itemName"><p>Item Name : {selectedItem.item_name}</p></div>
                                                            {/* <div className="modelNmuber"><p>Model Number : {selectedItem.model_number}</p></div> */}
                                                            <div className="brand"><p>Brand :{selectedItem.brand}</p></div>
                                                            <div className="description"><p>Description : {selectedItem.description}</p></div>
                                                            {/* <div className="contactNymber"><p>Contact Number : </p></div> */}
                                                            {/* <div className="inquire-section">
                                                            <Button variant="outlined" className='inqure-btn' style={{ marginLeft: '10px' }}>Inquire</Button>
                                                            <AiOutlineWhatsApp className='whatsapp' style={{ fontSize: '28px', paddingLeft: '15px' }} />
                                                        </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="closebtn-fram">
                                                    <AiFillCloseCircle className='close-btn' style={{ fontSize: '28px', color: 'red' }} onClick={closeItemView} />
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    {showUpdateWindow && selectedItem && selectedItem.item_id === data.item_id && (
                                        <div className='update-container'>
                                            <div className="card-container">
                                                <div className="header">
                                                    <h4>Update {selectedItem.item_name}</h4>
                                                </div>
                                                <form onSubmit={submit}>
                                                    <div className="input-section">
                                                        <div className="input-wrapper">
                                                            <input type="text" name="item-name" placeholder='Enter the Item Name' className='item-name' id='itemName' value={itemName} required onChange={handleItemNameChange} />
                                                            <input type="text" name="brand" placeholder='Enter the Brand Name' className='brand' id='brandName' value={brandName} required onChange={handleBrandChange} />
                                                            <input type="text" name="description" placeholder='Enter the Description' className='description' id='description' value={description} required onChange={handleDescriptionChange} />
                                                            <div className="image-holder" ><input type="file" name="item-image" id='itemImage' required onChange={handleImageChange} /></div>
                                                        </div>
                                                    </div>
                                                    <div className="submission-btn">
                                                        {/* <div  type="submit">Submit</div> */}
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
