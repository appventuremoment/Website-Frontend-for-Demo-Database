'use client';
import React, { useRef } from 'react';
import './styles.css';
import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams, notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAlert } from '@components/CustomConfirmation';
import { PubAlertProvider, usePubAlert } from '@components/CustomPublicationEdit';
import { PubAddProvider, usePubAddAlert } from '@components/CustomPublicationAdd';

function SearchContent() {
  const searchParams = useSearchParams();
  const tableType = searchParams.get('table');
  const router = useRouter();
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated') router.push('/login');
  }, [status, session, router]);

  switch (tableType) {
    case 'student':
      return (
        <PubAlertProvider>
          <PubAddProvider>
            <StudentsTable />
          </PubAddProvider>
        </PubAlertProvider>
      );
    case 'publication':
      return (
        <PubAlertProvider>
          <PubAddProvider>
            <PublicationsTable />
          </PubAddProvider>
        </PubAlertProvider>
      );
    default:
      return notFound();
  }
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

// function StudentsTable() {
//   const { showAlert } = useAlert();
//   const { showPubAlert } = usePubAlert();
//   const { showAddPubAlert } = usePubAddAlert();
//   const searchBar = useRef(null);
//   const startDate = useRef(null);
//   const endDate = useRef(null);
//   const fieldOfStudy = useRef(null);
//   const [tempData, setTempData] = useState([]);
  
//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch('/api/search/publication', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ whereclause: '' })
//       });
//       const data = await res.json();
//       setTempData(data);
//     };

//     fetchData();
//   }, [])

//   const handleAdd = async () => {
//     const updatedData = await showAddPubAlert('Add Publication', {});
//     if (updatedData) {
//       const res = await fetch('/api/add/publication', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedData),
//       });
  
//       if (res.ok) {
//         const res2 = await fetch('/api/search/publication', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ 
//             search: searchBar.current.value,
//             startDate: startDate.current.value,
//             endDate: endDate.current.value,
//             field_of_study: fieldOfStudy.current.value,
//           })});
//         const newdata = await res2.json();
//         setTempData(newdata);
//       }
//     }
//   }

//   const handleSearch = async () => {
//     const res = await fetch('/api/search/publication', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         search: searchBar.current.value,
//         startDate: startDate.current.value,
//         endDate: endDate.current.value,
//         field_of_study: fieldOfStudy.current.value,
//       })});
//     const data = await res.json();
//     setTempData(data);
//   }
  
  
//   const handleEdit = async (rowData) => {
//     const updatedData = await showPubAlert('Edit Details', rowData);
  
//     if (updatedData) {
//       const res = await fetch('/api/edit/publication', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedData),
//       });
  
//       if (res.ok) {
//         const res2 = await fetch('/api/search/publication', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ 
//             search: searchBar.current.value,
//             startDate: startDate.current.value,
//             endDate: endDate.current.value,
//             field_of_study: fieldOfStudy.current.value,
//           }),
//         });
//         const newdata = await res2.json();
//         setTempData(newdata);
//       }
//     }
//   };
  
//   const handleDelete = async (link) => {
//     const confirm = await showAlert('Are you sure you want to delete?');
//     if (confirm) {
//       const res = await fetch('/api/delete/publication', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ link })
//       });

//       if (res.ok) {
//         const res2 = await fetch('/api/search/publication', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ 
//             search: searchBar.current.value,
//             startDate: startDate.current.value,
//             endDate: endDate.current.value,
//             field_of_study: fieldOfStudy.current.value,
//           })});
//         const newdata = await res2.json();
//         setTempData(newdata);
//       }
//     }
//   }

//   return (
//     <div id='outer-div'>
//       <div id='filter-options'>
//         <b id='filter-title'>Filters</b>
//         <b style={{ fontSize: "1.75vmin", width: "100%"}}>Publication date between</b>
//         <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }}>
//           <p style={{ fontSize: "1.5vmin"  }}>Start date:</p>
//           <input type="date" style={{ fontSize: "1.5vmin", fontFamily: "Courier New, Courier, monospace", border: '0.1vmin solid #707070', borderRadius: '0.6vmin' }}  ref={startDate} onChange={handleSearch}/>
//         </div>
//         <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }}>
//           <p style={{ fontSize: "1.5vmin" }}>End date:</p>
//           <input type="date" style={{ fontSize: "1.5vmin", fontFamily: "Courier New, Courier, monospace", border: '0.1vmin solid #707070', borderRadius: '0.6vmin' }}  ref={endDate} onChange={handleSearch}/>
//         </div>
//         <div style={{ display: "flex", flexDirection: "row", gap: "1vmin", marginTop: "2vmin" }}>
//           <b style={{ fontSize: "1.75vmin"}}>Field of Study:</b>
//           <select onChange={handleSearch} ref={fieldOfStudy}>
//             <option value=''>None</option>
//             <option value="engineering">Engineering</option>
//             <option value="computer science">Computer Science</option>
//             <option value="mathematics">Mathematics</option>
//             <option value="chemistry">Chemistry</option>
//             <option value="physics">Physics</option>
//           </select>
//         </div>
//       </div>

//       <div id='search-div'>
//         <button onClick={ handleAdd }>
//           <img src="add_icon.png" alt="Icon" style={{ width: '2.5vmin', height: '2.5vmin' }}  />
//         </button>
//         <b id='table-title'>Students</b>
//         <input id="search-input" type="text" placeholder="Search" onChange={ handleSearch } ref={ searchBar }/>

//         <div id="table-container">
//           <table id="table">
//             <thead>
//               <tr id="column-names">
//                 <th>Project Name</th>
//                 <th>Field of study</th>
//                 <th>Journal</th>
//                 <th>Publisher</th>
//                 <th>Publication Date</th>
//                 <th>Link</th>
//                 <th>✎</th>
//                 <th>X</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tempData.map((tabledata, index) => (
//                 <tr key={tabledata.link} id={index % 2 === 0 ? 'row-even' : 'row-odd'}>
//                   <td>{tabledata.title}</td>
//                   <td>{tabledata.field_of_study}</td>
//                   <td>{tabledata.journal}</td>
//                   <td>{tabledata.publisher}</td>
//                   <td>{tabledata.publication_date}</td>
//                   <td>{tabledata.link}</td>

//                   <td>
//                     <button onClick={() => handleEdit(tabledata)}>
//                       <img src="edit_icon.png" alt="Icon" style={{ width: '1.75vmin', height: '1.75vmin' }} />
//                     </button>
//                   </td>

//                   <td>
//                     <button onClick={() => handleDelete(tabledata.link)}>
//                       <img src="delete_icon.png" alt="Icon" style={{ width: '1.75vmin', height: '1.75vmin' }}  />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <p style={{marginTop: '1vmin', fontSize: "1.75vmin", textAlign: "end"}}>{tempData.length} record{tempData.length === 1 ? '' : 's'} found</p>
//       </div>
//     </div>
//   );
// }

function PublicationsTable() {
  const { showAlert } = useAlert();
  const { showPubAlert } = usePubAlert();
  const { showAddPubAlert } = usePubAddAlert();
  const searchBar = useRef(null);
  const startDate = useRef(null);
  const endDate = useRef(null);
  const fieldOfStudy = useRef(null);
  const [tempData, setTempData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/search/publication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whereclause: '' })
      });
      const data = await res.json();
      setTempData(data);
    };

    fetchData();
  }, [])

  const handleAdd = async () => {
    const updatedData = await showAddPubAlert('Add Publication', {});
    if (updatedData) {
      const res = await fetch('/api/add/publication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
  
      if (res.ok) {
        const res2 = await fetch('/api/search/publication', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            startDate: startDate.current.value,
            endDate: endDate.current.value,
            field_of_study: fieldOfStudy.current.value,
          })});
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  }

  const handleSearch = async () => {
    const res = await fetch('/api/search/publication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        search: searchBar.current.value,
        startDate: startDate.current.value,
        endDate: endDate.current.value,
        field_of_study: fieldOfStudy.current.value,
      })});
    const data = await res.json();
    setTempData(data);
  }
  
  
  const handleEdit = async (rowData) => {
    const updatedData = await showPubAlert('Edit Details', rowData);
  
    if (updatedData) {
      const res = await fetch('/api/edit/publication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
  
      if (res.ok) {
        const res2 = await fetch('/api/search/publication', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            startDate: startDate.current.value,
            endDate: endDate.current.value,
            field_of_study: fieldOfStudy.current.value,
          }),
        });
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  };
  
  const handleDelete = async (link) => {
    const confirm = await showAlert('Are you sure you want to delete?');
    if (confirm) {
      const res = await fetch('/api/delete/publication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link })
      });

      if (res.ok) {
        const res2 = await fetch('/api/search/publication', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            startDate: startDate.current.value,
            endDate: endDate.current.value,
            field_of_study: fieldOfStudy.current.value,
          })});
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  }

  return (
    <div id='outer-div'>
      <div id='filter-options'>
        <b id='filter-title'>Filters</b>
        <b style={{ fontSize: "1.75vmin", width: "100%"}}>Publication date between</b>
        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }}>
          <p style={{ fontSize: "1.5vmin"  }}>Start date:</p>
          <input type="date" style={{ fontSize: "1.5vmin", fontFamily: "Courier New, Courier, monospace", border: '0.1vmin solid #707070', borderRadius: '0.6vmin' }}  ref={startDate} onChange={handleSearch}/>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }}>
          <p style={{ fontSize: "1.5vmin" }}>End date:</p>
          <input type="date" style={{ fontSize: "1.5vmin", fontFamily: "Courier New, Courier, monospace", border: '0.1vmin solid #707070', borderRadius: '0.6vmin' }}  ref={endDate} onChange={handleSearch}/>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin", marginTop: "2vmin" }}>
          <b style={{ fontSize: "1.75vmin"}}>Field of Study:</b>
          <select onChange={handleSearch} ref={fieldOfStudy}>
            <option value=''>None</option>
            <option value="engineering">Engineering</option>
            <option value="computer science">Computer Science</option>
            <option value="mathematics">Mathematics</option>
            <option value="chemistry">Chemistry</option>
            <option value="physics">Physics</option>
          </select>
        </div>
      </div>

      <div id='search-div'>
        <button onClick={ handleAdd }>
          <img src="add_icon.png" alt="Icon" style={{ width: '2.5vmin', height: '2.5vmin' }}  />
        </button>
        <b id='table-title'>Publications</b>
        <input id="search-input" type="text" placeholder="Search" onChange={ handleSearch } ref={ searchBar }/>

        <div id="table-container">
          <table id="table">
            <thead>
              <tr id="column-names">
                <th>Project Name</th>
                <th>Field of study</th>
                <th>Journal</th>
                <th>Publisher</th>
                <th>Publication Date</th>
                <th>Link</th>
                <th>✎</th>
                <th>X</th>
              </tr>
            </thead>
            <tbody>
              {tempData.map((tabledata, index) => (
                <tr key={tabledata.link} id={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td>{tabledata.title}</td>
                  <td>{tabledata.field_of_study}</td>
                  <td>{tabledata.journal}</td>
                  <td>{tabledata.publisher}</td>
                  <td>{tabledata.publication_date}</td>
                  <td>{tabledata.link}</td>

                  <td>
                    <button onClick={() => handleEdit(tabledata)}>
                      <img src="edit_icon.png" alt="Icon" style={{ width: '1.75vmin', height: '1.75vmin' }} />
                    </button>
                  </td>

                  <td>
                    <button onClick={() => handleDelete(tabledata.link)}>
                      <img src="delete_icon.png" alt="Icon" style={{ width: '1.75vmin', height: '1.75vmin' }}  />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{marginTop: '1vmin', fontSize: "1.75vmin", textAlign: "end"}}>{tempData.length} record{tempData.length === 1 ? '' : 's'} found</p>
      </div>
    </div>
  );
}