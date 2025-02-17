import React from "react";
import { useQuery } from "@tanstack/react-query";
import PromoCodesUi from "../../ui/PromoCodeUi/page";


const PromoCodeManager = ()=>{
   
////  React Query 



return(<>

<div>
<div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="bg-custom-blue p-12 h-60 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">
              @ Promo Code Manager
            </h1>
            <Box
              component="button"
              onClick={() => navigate("/app/add-promoCode")}
              display="flex"
              padding="0.5rem"
              sx={{
                backgroundColor: "white",
                borderRadius: "2rem",
                overflow: "hidden",
              }}
            >
              <Add />
              {resWidth ? <Typography>Add</Typography> : ""}
            </Box>
          </div>
          <div className=" mx-auto px-6 drop-shadow-lg ">
            
           <PromoCodesUi data={data} />
          </div>
        </div>
      </div>
    </div>
</div>

</>)

}

export default PromoCodeManager;


//React Query Function goes here------>>>>>>>