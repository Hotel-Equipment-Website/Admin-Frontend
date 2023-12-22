import React from 'react'
import './CategoryAdd.scss'
import instance from '../../../../utility/AxiosInstance';


export default function CategoryAdd(props) {

    const submit = async (e) => {
        e.preventDefault();

        // get token from local storage
        const token = await localStorage.getItem('loginToken');

        // create authentication header
        const config = {
            headers: {
                'Authorization': token,
                'Content-Type': 'multipart/form-data'
            }
        };

        // console.log(token);
        const formData = new FormData();


        formData.append('name', e.target['category-name'].value);
        formData.append('images', e.target['category-image'].files[0]);


        instance.post('/category', formData, config).then((res) => {
            // console.log(res);
            props.setTrigger(prv => !prv)
            if (res.status === 200) {
                alert('Category Added Successfully');
            }
        }
        ).catch((err) => {
            console.log(err);

        })

            .finally(() => {
                // Always close the popup window
                props.setDisplayCategoryAdd(false);
            });
    }


    return (
        <div className='categoryAdd-container'>
            <div className="card-container">
                <div className="header">
                    <h4>Category Add</h4>
                </div>
                <form onSubmit={submit}>
                    <div className="input-section">
                        <div className="input-wrapper">
                            <input type="text" name="category-name" placeholder='Enter the Category Name' className='category-name' required />
                            <div className="image-holder" ><input type="file" name="category-image" required /></div>
                        </div>
                    </div>
                    <div className="submission-btn">
                        {/* <div  type="submit">Submit</div> */}
                        <input className="submit-btn" type="submit" />
                        <div className="cancel-btn" onClick={() => props.setDisplayCategoryAdd(false)}>Cancel</div>
                    </div>
                </form>
            </div>
        </div>
    )
}
