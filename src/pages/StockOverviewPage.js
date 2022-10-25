import StockAuto from '../components/AutoComplete';
import StockList from '../components/StockList';
import Logo from '../assets/logo.png';


function StockOverviewPage() {

    return (
        <div className='overview'>
            <img className='logo' src={Logo} alt='Logo' />
            <StockAuto />
            <StockList />
        </div>
    )
}


export default StockOverviewPage;