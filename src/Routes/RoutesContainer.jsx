import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../Components/Authontication/Login';
import Category from '../Components/Dashboard/Category/Category';
import Item from '../Components/Dashboard/Item/Item';

function RoutesContainer() {
  return (
    <Router>

      <Routes>
        <Route path='/auth' element={<Login />} />
        <Route path="/" element={<Category />} />
        <Route path="/item/:category_id/:category_name" element={<Item />} />
      </Routes>
    </Router>
  );
}

export default RoutesContainer;
