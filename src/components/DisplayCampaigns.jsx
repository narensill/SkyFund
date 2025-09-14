import React from 'react'
import { useNavigate } from 'react-router-dom'
import {loader} from '../assets'
import CampaignCard from './CampaignCard'


const DisplayCampaigns = ({title , isLoading, campaigns}) => {
    const navigate = useNavigate();
    const handleNavigate = (campaign) => {
      navigate(`/campaign-details/${campaign.title}`, {state: campaign});
    }

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-black text-left">{title} ({campaigns.length})</h1>
    <div className=" flex flex-wrap mt-[20px] gap-[26px]">
      {isLoading && (
        <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain"/>
      )}
      {isLoading && campaigns.length === 0 &&(
        <p className='text-left font-epilogue font-semibold text-[16px] leading-[30px] text-[#818183]'> 
        No campaigns to show!!
        </p>
      )}
      {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => 
      <CampaignCard
        key={campaign.id}
        {...campaign}
        handleClick={()=> handleNavigate(campaign)}
      />)}

    </div>
    </div>
  )
}

export default DisplayCampaigns
