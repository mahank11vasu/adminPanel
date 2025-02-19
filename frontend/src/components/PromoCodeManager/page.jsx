import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";  
import PromoCodesUi from "../../ui/PromoCodeUi/page";
import { Box, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

const fetchPromoCodes = async ({ queryKey }) => {
  const [_key, page, entriesPerPage] = queryKey;
  const response = await fetch("/Data/MockData.json");
  if (!response.ok) throw new Error("Failed to fetch promo codes");

  const allData = await response.json();
  
  // Pagination Logic
  const start = (page - 1) * entriesPerPage;
  const paginatedData = allData.slice(start, start + entriesPerPage);

  return { 
    data: paginatedData,
    totalEntries: allData.length
  };
};

const PromoCodeManager = () => {
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["promoCodes", currentPage, entriesPerPage],
    queryFn: fetchPromoCodes,
    keepPreviousData: true, 
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const totalPages = Math.ceil(data.totalEntries / entriesPerPage);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="bg-custom-blue p-12 h-60 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">@ Promo Code Manager</h1>
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
              <Typography>Add</Typography>
            </Box>
          </div>
          <div className="mx-auto px-6 drop-shadow-lg">
            <PromoCodesUi 
              data={data.data} 
              currentPage={currentPage} 
              totalPages={totalPages} 
              setCurrentPage={setCurrentPage}
              entriesPerPage={entriesPerPage}
              setEntriesPerPage={setEntriesPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCodeManager;