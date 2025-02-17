import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Switch } from "@mui/material";
import axios from "axios";

const PromoCodesUi = ({ data, setData }) => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const[selectIdCode,setSelectIdCode] = useState(null);
  const navigate = useNavigate();

  console.log("Data->>>>>",data);
  const totalEntries = data.length;

  console.log(totalEntries,"Entries Length");
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems2 = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditClick = (promo,promoID) => {
    setSelectedPromo(promo);
    setOpenModal(true);
    setSelectIdCode(promoID);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPromo(null);
  };

  const handleSaveDetails = async (promoData) => {
     try{
       const res = await axios.put(`${import.meta.env.VITE_mainURL}${import.meta.env.VITE_updatePromo}/${selectIdCode}`,promoData);
       
       if(res.status==200){
        handleCloseModal();
        setSelectIdCode(null);
       }

     }catch(err){
        console.log(err);
     }
  };


  const disableCouponCode = async(id)=>{
      try{
        const res = await axios.patch(`${import.meta.env.VITE_mainURL}${import.meta.env.VITE_disablePromo}/${id}`);
         
         if(res.status==200){
            alert("Code Disable Successfully");
         }
      }catch(err){
            console.log(err);
      }
  }

  return (
    <div className="mx-auto mt-4 rounded-2xl shadow-2xl" style={{ boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px" }}>
      <div className="w-full p-4 bg-[#F6F4F4]">
        <h1 className="font-bold text-custom-blue">View Entries</h1>
      </div>
      <div className="mx-auto px-4 py-8 bg-white">
        <div className="flex justify-between mb-4 text-[14px] font-bold">
          <div className="flex flex-col gap-2">
            <label>Show</label>
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(parseInt(e.target.value, 10))} className="border p-2 rounded w-40">
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="text-custom-blue">
              {["S.No", "Code", "Expiry Date", "Discount Value", "Discount Type", "Min Order Value", "Usage Limit", "Used Count", "Status", "EDIT"].map((header) => (
                <th key={header} className="px-4 py-2 text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-black border-y-2 text-[14px] text-[#706D6D]">
            {currentItems2.map((res, index) => (
              <tr key={res._id} className={`border-t ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-100"} ${!res.status ? "bg-red-500 text-white" : "bg-white"}`}>
                <td className="px-4 py-2 text-center">{index + indexOfFirstItem + 1}</td>
                <td className="px-4 py-2 text-center">{res?.code || "N/A"}</td>
                <td className="px-4 py-2 text-center">
                  <div>
                    {res?.expiryDate ? new Date(res.expiryDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">{res?.discountValue}</td>
                <td className="px-4 py-2 text-center">{res?.discountType}</td>
                <td className="px-4 py-2 text-center">{res?.minOrderValue}</td>
                <td className="px-4 py-2 text-center">{res?.usageLimit}</td>
                <td className="px-4 py-2 text-center">{res?.usedCount}</td>
                <td>
                  <div className="">
                    <Switch checked={!res.is_Active} inputProps={{ "aria-label": "Show" }} onChange={() => {disableCouponCode(res._id)}} />
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <IconButton onClick={() => handleEditClick(res,res._id)}>
                      <Edit sx={{ backgroundColor: "#03163B", color: "white", borderRadius: "1rem", padding: "0.5rem", fontSize: "40px" }} />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index} className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          ))}
          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      {/* Modal for Editing Promo Code */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Promo Code</DialogTitle>
        <DialogContent>
          {selectedPromo && (
            <>
              <TextField
                margin="dense"
                label="Code"
                type="text"
                fullWidth
                value={selectedPromo.code}
                onChange={(e) => setSelectedPromo({ ...selectedPromo, code: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Expiry Date"
                type="date"
                fullWidth
                value={selectedPromo.expiryDate ? new Date(selectedPromo.expiryDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setSelectedPromo({ ...selectedPromo, expiryDate: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="dense"
                label="Discount Value"
                type="number"
                fullWidth
                value={selectedPromo.discountValue}
                onChange={(e) => setSelectedPromo({ ...selectedPromo, discountValue: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Discount Type"
                type="text"
                fullWidth
                value={selectedPromo.discountType}
                onChange={(e) => setSelectedPromo({ ...selectedPromo, discountType: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Min Order Value"
                type="number"
                fullWidth
                value={selectedPromo.minOrderValue}
                onChange={(e) => setSelectedPromo({ ...selectedPromo, minOrderValue: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Usage Limit"
                type="number"
                fullWidth
                value={selectedPromo.usageLimit}
                onChange={(e) => setSelectedPromo({ ...selectedPromo, usageLimit: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Used Count"
                type="number"
                fullWidth
                value={selectedPromo.usedCount}
                onChange={(e) => setSelectedPromo({ ...selectedPromo, usedCount: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={()=>{handleSaveDetails(selectedPromo)}} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PromoCodesUi;
