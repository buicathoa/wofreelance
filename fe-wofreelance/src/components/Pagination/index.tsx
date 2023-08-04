import { Pagination } from 'antd'
import React, { useState } from 'react'

import './style.scss'

interface paginationDivide {
  totalRecord: number,
  handlePagingAction: any
}

export const PaginationDivide = ({ totalRecord, handlePagingAction }: paginationDivide) => {

  const [currentPage, setCurrentPage] = useState(1)
  const [viewInPage, setViewInPage] = useState(10)

  const handleChangePage = (currentPageValue: number, viewInPageValue:number) => {
    handlePagingAction(currentPageValue, viewInPageValue)
  }

  return (
    <div className="pagination-wrapper">
      <Pagination
        current={currentPage}
        total={totalRecord}
        // showSizeChanger={false}
        pageSize={viewInPage} 
        onChange={handleChangePage}/>
    </div>
  )
}
