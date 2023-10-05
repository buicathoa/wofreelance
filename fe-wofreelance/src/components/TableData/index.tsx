import React from 'react'
import './style.scss'
import { Link } from 'react-router-dom'
import { Empty } from 'antd'

interface TableData {
    titleHeader: Array<any>,
    tableData: Array<any>,
    renderTableBody: any
}
export const TableData = ({ titleHeader, tableData, renderTableBody }: TableData) => {

    console.log('tableData', tableData)
    return (
        <div className="table-data-wrapper">
            <table>
                <thead>
                    <tr>
                        {titleHeader?.map((header, idx) => {
                            return (
                                <th key={idx}>{header?.label}</th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody className={tableData?.length === 0 ? 'empty' : ''}>
                    {tableData?.length > 0 ? renderTableBody() : <Empty />}
                </tbody>
            </table>
        </div>
    )
}
