'use client';
import React from 'react';
import './styles.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const tempdata = [
    { id: 'h20100', fname: "Example", lname: "e", year: "6"},
    { id: 'h20101', fname: "Example", lname: "e", year: "6"},
    { id: 'h20102', fname: "Example", lname: "e", year: "6"}
  ];

  // Handle Session ID rerouting
  useEffect(() => {
    if (status === 'loading') return; // Wait for auth token to load
    if (status !== 'authenticated') router.push('/login');
  }, [status, session, router])

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
            {tempdata.map((student, index) => (
              // TODO: Chip IDs will not be simple numbers + Searching will change the IDs, change zebra colouring to be independant of data in table when functionalities work
              <tr 
                key={student.id}
                id={index % 2 === 0 ? 'row-even' : 'row-odd'}
              >
                <td>{student.id}</td>
                <td>{student.fname}</td>
                <td><span style={{ backgroundColor: "yellow" }}>Nam</span>{student.lname}</td>
                <td><span style={{ backgroundColor: "yellow" }}>{student.year}</span></td>
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
}