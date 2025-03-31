import React from 'react';
import './styles.css';

const TableContents = () => {
  const catsdata = [
    { id: 'h2010049', name: "Example", arrival: "6", gender: "e"}
  ];

  return (
    <div id="background">
      {/* Search */}
      <div id="search-container">
        <input id="search-input" type="text" placeholder="Search" value={'Last Name=Nam, Year of Study=6'} disabled/>
        <img id='search-icon' src='search_icon2.png'></img>
      </div>

      {/* Table View */}
      <div id="table-container">
        <table id="table">
          <thead>
            <tr id="column-names">
              <th>Student ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Year of Study</th>
            </tr>
          </thead>
          <tbody>
            {catsdata.map((cat, index) => (
              // TODO: Chip IDs will not be simple numbers + Searching will change the IDs, change zebra colouring to be independant of data in table when functionalities work
              <tr 
                key={cat.id}
                id={index % 2 === 0 ? 'row-even' : 'row-odd'}
              >
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td><span style={{ backgroundColor: "yellow" }}>Nam</span>{cat.gender}</td>
                <td><span style={{ backgroundColor: "yellow" }}>{cat.arrival}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div id="pagination-container">
        <button id="page-button">←</button>
        {/* TODO: Placeholder until I need to code functionalities */}
        <button id="page-button-active">1</button>
        <button id="page-button">2</button>
        ...
        <input id='page-input' value={'8'} disabled></input>
        ...
        <button id="page-button">11</button>
        <button id="page-button">12</button>
        <button id="page-button">→</button>
      </div>
    </div>
  );
};

export default TableContents;