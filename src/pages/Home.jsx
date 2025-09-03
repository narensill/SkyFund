import React ,{useState , useEffect} from 'react';
import { useStateContext } from '../context/useStateContext.js';


const Home = () => {
  const [isLoading , setisLoading] = useState(false);
  const[campaigns , setCampaigns] = useState([]);
  const {address , contract , getCampaigns} = useStateContext();
  const fetchCampaigns = async()=>{
    setisLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setisLoading(false);
  }
  useEffect(()=>{
    if(contract) fetchCampaigns();
  }, [address , contract]);
  return (
    <div>
      Home
    </div>
  )
}

export default Home
