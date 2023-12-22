import React from 'react'
import './ItemAdd.scss'
import instance from '../../../../utility/AxiosInstance';

export default function ItemAdd(props) {

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

        formData.append('category_id', props.catID);
        formData.append('item_name', e.target['item-name'].value);
        formData.append('model_number', " ");
        formData.append('brand', e.target['brand'].value);
        formData.append('description', e.target['description'].value);
        formData.append('images', e.target['item-image'].files[0]);

        instance.post('/item', formData, config).then((res) => {
            // console.log(res);
            props.setTrigger(prv => !prv)
            if (res.status === 200) {
                alert('Item Added Successfully');
            }
        }
        ).catch((err) => {
            console.log(err);

        })

            .finally(() => {
                // Always close the popup window
                props.setDisplayItemAdd(false);
            });
    }

    function hide() {
        props.setDisplayItemAdd();
    }

    return (
        <div className='itemAdd-container'>
            <div className="card-container">
                <div className="header">
                    <h4>Category Add {props.catID}</h4>
                </div>
                <form onSubmit={submit}>
                    <div className="input-section">
                        <div className="input-wrapper">
                            <input type="text" name="item-name" placeholder='Enter the Item Name' className='item-name' required />
                            <input type="text" name="brand" placeholder='Enter the Brand Name' className='brand' required />
                            <input type="text" name="description" placeholder='Enter the Description' className='description' required />
                            <div className="image-holder" ><input type="file" name="item-image" required /></div>
                        </div>
                    </div>
                    <div className="submission-btn">
                        {/* <div  type="submit">Submit</div> */}
                        <input className="submit-btn" type="submit" />
                        <div className="cancel-btn" onClick={hide}>Cancel</div>
                    </div>
                </form>
            </div>
        </div>
    )
}
