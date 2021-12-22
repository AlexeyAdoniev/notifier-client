import React from "react";
import { Spin } from "antd";

import { LoadingOutlined } from "@ant-design/icons";

export const Table = ({ tableInstance, fetching, onRowClick }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="tableWrapper">
      <div className="tableScroll">
        {!fetching ? (
          <table {...getTableProps()}>
            <thead>
              {
                // Loop over the header rows
                headerGroups.map((headerGroup) => (
                  // Apply the header row props
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {
                      // Loop over the headers in each row
                      headerGroup.headers.map((column) => (
                        // Apply the header cell props
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {
                            // Render the header
                            column.render("Header")
                          }
                        </th>
                      ))
                    }
                  </tr>
                ))
              }
            </thead>
            {/* Apply the table body props */}
            <tbody {...getTableBodyProps()}>
              {
                // Loop over the table rows
                rows.map((row) => {
                  // Prepare the row for display
                  prepareRow(row);
                  return (
                    // Apply the row props
                    <tr
                      {...row.getRowProps({
                        onClick: (some) => onRowClick(row),
                      })}
                    >
                      {
                        // Loop over the rows cells
                        row.cells.map((cell) => {
                          const {
                            column: { attrs },
                          } = cell;
                          // Apply the cell props

                          return (
                            <td
                              {...cell.getCellProps([
                                {
                                  ...attrs,
                                },
                              ])}
                              //className={cell.column.columnClass}
                            >
                              <span>
                                {
                                  // Render the cell contents
                                  cell.render("Cell")
                                }
                              </span>
                            </td>
                          );
                        })
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        ) : (
          <Spin
            className="spinner"
            indicator={<LoadingOutlined style={{ fontSize: 115 }} spin />}
          />
        )}
      </div>
    </div>
  );
};
