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
import { StudentAlertProvider, useStudentAlert } from '@components/CustomStudentEdit';
import { StudentAddProvider, useStudentAddAlert } from '@components/CustomStudentAdd';
import { SSEFProjectAlertProvider, useSSEFProjectAlert } from '@components/CustomSSEFProjectEdit';
import { SSEFProjectAddProvider, useSSEFProjectAddAlert } from '@components/CustomSSEFProjectAdd';
import { ProjectAlertProvider, useProjectAlert } from '@components/CustomProjectEdit';
import { ProjectAddProvider, useProjectAddAlert } from '@components/CustomProjectAdd';

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
        <StudentAlertProvider>
          <StudentAddProvider>
            <StudentsTable />
          </StudentAddProvider>
        </StudentAlertProvider>
      );
    case 'project':
      return (
        <ProjectAlertProvider>
          <ProjectAddProvider>
            <ProjectsTable />
          </ProjectAddProvider>
        </ProjectAlertProvider>
      );
    case 'ssef_project':
      return (
        <SSEFProjectAlertProvider>
          <SSEFProjectAddProvider>
            <SSEFProjectsTable />
          </SSEFProjectAddProvider>
        </SSEFProjectAlertProvider>
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

function ProjectsTable() {
  const { showAlert } = useAlert();
  const { showProjectAlert } = useProjectAlert();
  const { showProjectAddAlert } = useProjectAddAlert();
  const searchBar = useRef(null);
  const taken = useRef(null);
  const fieldOfStudy = useRef(null);
  const readyToPresent = useRef(null);
  const submittedPoster = useRef(null);
  const industryFilter = useRef(null);
  const externalCompany = useRef(null);
  const [tempData, setTempData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/search/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      setTempData(data);
    };

    fetchData();
  }, [])

  const handleAdd = async () => {
    const updatedData = await showProjectAddAlert('Add Project', {});
    if (updatedData) {
      const res = await fetch('/api/add/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
  
      if (res.ok) {
        const res2 = await fetch('/api/search/project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            taken: taken.current.querySelector('input[name="taken"]:checked')?.value,
            field_of_study: fieldOfStudy.current.value,
            readyToPresent: readyToPresent.current.querySelector('input[name="readyToPresent"]:checked')?.value,
            submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
            industryFilter: industryFilter.current.value,
            externalCompany: externalCompany.current.value,
          })});
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  }

  const handleSearch = async () => {
    const res = await fetch('/api/search/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        search: searchBar.current.value,
        taken: taken.current.querySelector('input[name="taken"]:checked')?.value,
        field_of_study: fieldOfStudy.current.value,
        readyToPresent: readyToPresent.current.querySelector('input[name="readyToPresent"]:checked')?.value,
        submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
        industryFilter: industryFilter.current.value,
        externalCompany: externalCompany.current.value,
      }),
    });
    const data = await res.json();
    setTempData(data);
  };
  
  const handleEdit = async (rowData) => {
    const updatedData = await showProjectAlert('Edit Details', rowData);
  
    if (updatedData) {
      const res = await fetch('/api/edit/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
  
      if (res.ok) {
        const res2 = await fetch('/api/search/project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            taken: taken.current.querySelector('input[name="taken"]:checked')?.value,
            field_of_study: fieldOfStudy.current.value,
            readyToPresent: readyToPresent.current.querySelector('input[name="readyToPresent"]:checked')?.value,
            submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
            industryFilter: industryFilter.current.value,
            externalCompany: externalCompany.current.value,
          }),
        });
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  };
  
  const handleDelete = async (internal_code) => {
    const confirm = await showAlert('Are you sure you want to delete?');
    if (confirm) {
      const res = await fetch('/api/delete/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internal_code })
      });

      if (res.ok) {
        const res2 = await fetch('/api/search/project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            taken: taken.current.querySelector('input[name="taken"]:checked')?.value,
            field_of_study: fieldOfStudy.current.value,
            readyToPresent: readyToPresent.current.querySelector('input[name="readyToPresent"]:checked')?.value,
            submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
            industryFilter: industryFilter.current.value,
            externalCompany: externalCompany.current.value,
          })});
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  }

  return (
    <div id="outer-div">
      <div id="filter-options">
        <b id="filter-title">Filters</b>
        <div style={{ marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Taken?</b>
          <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }} ref={taken}>
            <label><input type="radio" name="taken" value="true" onChange={handleSearch} /> ✅</label>
            <label><input type="radio" name="taken" value="false" onChange={handleSearch} /> ❌</label>
            <label><input type="radio" name="taken" value="" onChange={handleSearch} defaultChecked /> Any</label>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin", marginTop: "2vmin", alignItems: "center" }}>
          <b style={{ fontSize: "2vmin"}}>Field of Study:</b>
          <input type="text" id='filter-input' ref={fieldOfStudy} onChange={handleSearch}/>
        </div>

        <div style={{ marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Ready to present:</b>
          <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }} ref={readyToPresent}>
            <label><input type="radio" name="readyToPresent" value="true" onChange={handleSearch} /> ✅</label>
            <label><input type="radio" name="readyToPresent" value="false" onChange={handleSearch} /> ❌</label>
            <label><input type="radio" name="readyToPresent" value="" onChange={handleSearch} defaultChecked /> Any</label>
          </div>
        </div>

        <div style={{ marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Submitted Poster:</b>
          <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }} ref={submittedPoster}>
            <label><input type="radio" name="submittedPoster" value="true" onChange={handleSearch} /> ✅</label>
            <label><input type="radio" name="submittedPoster" value="false" onChange={handleSearch} /> ❌</label>
            <label><input type="radio" name="submittedPoster" value="" onChange={handleSearch} defaultChecked /> Any</label>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin", marginTop: "2vmin", alignItems: "center" }}>
          <b style={{ fontSize: "2vmin"}}>External company:</b>
          <input type="text" id='filter-input' ref={externalCompany} onChange={handleSearch}/>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin", marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Industry:</b>
          <select onChange={handleSearch} ref={industryFilter}>
            <option value=''>None</option>
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Construction">Construction</option>
          </select>
        </div>
      </div>
      <div id="search-div">
        <button onClick={handleAdd}><img src="add_icon.png" alt="Icon" style={{ width: '4vmin', height: '4vmin' }} /></button>
        <b id="table-title">Projects</b>
        <input id="search-input" type="text" placeholder="Search" onChange={handleSearch} ref={searchBar} />

        <p style={{marginTop: '1vmin', fontSize: "2vmin", textAlign: "end"}}>{tempData.length} record{tempData.length === 1 ? '' : 's'} found</p>
        <div id="table-container">
          <table id="table">
            <thead>
              <tr id="column-names">
                <th>Project code</th>
                <th>Project name</th>
                <th>Field of study</th>
                <th>taken?</th>
                <th>Ready to present?</th>
                <th>Poster received?</th>
                <th>Internal mentor</th>
                <th>External mentor</th>
                <th>External company</th>
                <th>Company industry</th>
                <th>SSEF code</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tempData.map((tabledata, index) => (
                <tr key={tabledata.internal_code} id={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td>{tabledata.internal_code}</td>
                  <td>{tabledata.title}</td>
                  <td>{tabledata.field_of_study}</td>
                  <td style={{ textAlign: "center"}}>{tabledata.taken === 1 ? '✅' : '❌'}</td>
                  <td style={{ textAlign: "center"}}>{tabledata.present_ready === 1 ? '✅' : '❌'}</td>
                  <td style={{ textAlign: "center"}}>{tabledata.poster_received === 1 ? '✅' : '❌'}</td>
                  <td>{tabledata.IMemail}</td>
                  <td>{tabledata.EMemail}</td>
                  <td>{tabledata.company_name}</td>
                  <td>{tabledata.industry}</td>
                  <td>{tabledata.ssef_code}</td>
                  <td style={{ textAlign: "center"}}><button onClick={() => handleEdit(tabledata)}><img src="edit_icon.png" alt="Icon" style={{ width: '2vmin', height: '2vmin' }} /></button></td>
                  <td style={{ textAlign: "center"}}><button onClick={() => handleDelete(tabledata.internal_code)}><img src="delete_icon.png" alt="Icon" style={{ width: '2.5vmin', height: '2.5vmin' }} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SSEFProjectsTable() {
  const { showAlert } = useAlert();
  const { showSSEFProjectAlert } = useSSEFProjectAlert();
  const { showSSEFProjectAddAlert } = useSSEFProjectAddAlert();
  const searchBar = useRef(null);
  const submittedForms = useRef(null);
  const submittedPoster = useRef(null);
  const ssefResult = useRef(null);
  const fieldOfStudy = useRef(null);
  const industryFilter = useRef(null);
  const [tempData, setTempData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/search/ssef_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      setTempData(data);
    };

    fetchData();
  }, [])

  const handleAdd = async () => {
    const updatedData = await showSSEFProjectAddAlert('Add SSEF Project', {});
    if (updatedData) {
      const res = await fetch('/api/add/ssef_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
  
      if (res.ok) {
        const res2 = await fetch('/api/search/ssef_project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            field_of_study: fieldOfStudy.current.value,
            ssefResult: ssefResult.current.value,
            submittedForms: submittedForms.current.querySelector('input[name="submittedForms"]:checked')?.value,
            submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
            industryFilter: industryFilter.current.value,
          })});
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  }

  const handleSearch = async () => {
    const res = await fetch('/api/search/ssef_project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        search: searchBar.current.value,
        field_of_study: fieldOfStudy.current.value,
        ssefResult: ssefResult.current.value,
        submittedForms: submittedForms.current.querySelector('input[name="submittedForms"]:checked')?.value,
        submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
        industryFilter: industryFilter.current.value,
      }),
    });
    const data = await res.json();
    setTempData(data);
  };
  
  const handleEdit = async (rowData) => {
    const updatedData = await showSSEFProjectAlert('Edit Details', rowData);
  
    if (updatedData) {
      const res = await fetch('/api/edit/ssef_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
  
      if (res.ok) {
        const res2 = await fetch('/api/search/ssef_project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            field_of_study: fieldOfStudy.current.value,
            ssefResult: ssefResult.current.value,
            submittedForms: submittedForms.current.querySelector('input[name="submittedForms"]:checked')?.value,
            submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
            industryFilter: industryFilter.current.value,
          }),
        });
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  };
  
  const handleDelete = async (ssef_code) => {
    const confirm = await showAlert('Are you sure you want to delete?');
    if (confirm) {
      const res = await fetch('/api/delete/ssef_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssef_code })
      });

      if (res.ok) {
        const res2 = await fetch('/api/search/ssef_project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            field_of_study: fieldOfStudy.current.value,
            ssefResult: ssefResult.current.value,
            submittedForms: submittedForms.current.querySelector('input[name="submittedForms"]:checked')?.value,
            submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
            industryFilter: industryFilter.current.value,
          })});
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  }

  return (
    <div id="outer-div">
      <div id="filter-options">
        <b id="filter-title">Filters</b>
        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin", marginTop: "2vmin", alignItems: "center" }}>
          <b style={{ fontSize: "2vmin"}}>Field of Study:</b>
          <input type="text" id='filter-input' ref={fieldOfStudy} onChange={handleSearch}/>
        </div>

        <div style={{ marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Submitted Forms:</b>
          <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }} ref={submittedForms}>
            <label><input type="radio" name="submittedForms" value="true" onChange={handleSearch} /> ✅</label>
            <label><input type="radio" name="submittedForms" value="false" onChange={handleSearch} /> ❌</label>
            <label><input type="radio" name="submittedForms" value="" onChange={handleSearch} defaultChecked /> Any</label>
          </div>
        </div>

        <div style={{ marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Submitted Poster:</b>
          <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }} ref={submittedPoster}>
            <label><input type="radio" name="submittedPoster" value="true" onChange={handleSearch} /> ✅</label>
            <label><input type="radio" name="submittedPoster" value="false" onChange={handleSearch} /> ❌</label>
            <label><input type="radio" name="submittedPoster" value="" onChange={handleSearch} defaultChecked /> Any</label>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin", marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Result:</b>
          <select ref={ssefResult} onChange={handleSearch}>
            <option value="">None</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
            <option value="merit">Merit</option>
            <option value="finalist">Finalist</option>
            <option value="participation">Participation</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin", marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Industry:</b>
          <select onChange={handleSearch} ref={industryFilter}>
            <option value=''>None</option>
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Construction">Construction</option>
          </select>
        </div>
      </div>
      <div id="search-div">
        <button onClick={handleAdd}><img src="add_icon.png" alt="Icon" style={{ width: '4vmin', height: '4vmin' }} /></button>
        <b id="table-title">SSEF Projects</b>
        <input id="search-input" type="text" placeholder="Search" onChange={handleSearch} ref={searchBar} />

        <p style={{marginTop: '1vmin', fontSize: "2vmin", textAlign: "end"}}>{tempData.length} record{tempData.length === 1 ? '' : 's'} found</p>
        <div id="table-container">
          <table id="table">
            <thead>
              <tr id="column-names">
                <th>Project name</th>
                <th>Field of study</th>
                <th>SSEF Code</th>
                <th>Forms received?</th>
                <th>Poster received?</th>
                <th>Result</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tempData.map((tabledata, index) => (
                <tr key={tabledata.ssef_code} id={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td>{tabledata.title}</td>
                  <td>{tabledata.field_of_study}</td>
                  <td>{tabledata.ssef_code}</td>
                  <td style={{ textAlign: "center"}}>{tabledata.forms_received === 1 ? '✅' : '❌'}</td>
                  <td style={{ textAlign: "center"}}>{tabledata.poster_received === 1 ? '✅' : '❌'}</td>
                  <td>{tabledata.result}</td>
                  <td style={{ textAlign: "center"}}><button onClick={() => handleEdit(tabledata)}><img src="edit_icon.png" alt="Icon" style={{ width: '2vmin', height: '2vmin' }} /></button></td>
                  <td style={{ textAlign: "center"}}><button onClick={() => handleDelete(tabledata.ssef_code)}><img src="delete_icon.png" alt="Icon" style={{ width: '2.5vmin', height: '2.5vmin' }} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentsTable() {
  const { showAlert } = useAlert();
  const { showStudentAlert } = useStudentAlert();
  const { showAddStudentAlert } = useStudentAddAlert();
  const searchBar = useRef(null);
  const filterYear = useRef(null);
  const hasPublication = useRef(null);
  const hasProject = useRef(null);
  const readyToPresent = useRef(null);
  const submittedPoster = useRef(null);
  const hasSsefProject = useRef(null);
  const [tempData, setTempData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/search/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      setTempData(data);
    };

    fetchData();
  }, [])

  const handleAdd = async () => {
    const updatedData = await showAddStudentAlert('Add Student', {});
    if (updatedData) {
      const res = await fetch('/api/add/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
  
      if (res.ok) {
        const res2 = await fetch('/api/search/student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            year: filterYear.current.value,
            hasPublication: hasPublication.current.querySelector('input[name="hasPublication"]:checked')?.value,
            hasProject: hasProject.current.querySelector('input[name="hasProject"]:checked')?.value,
            readyToPresent: readyToPresent.current.querySelector('input[name="readyToPresent"]:checked')?.value,
            submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
            hasSsefProject: hasSsefProject.current.querySelector('input[name="hasSsefProject"]:checked')?.value,
          })});
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  }

  const handleSearch = async () => {
    const res = await fetch('/api/search/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        search: searchBar.current.value,
        year: filterYear.current.value,
        hasPublication: hasPublication.current.querySelector('input[name="hasPublication"]:checked')?.value,
        hasProject: hasProject.current.querySelector('input[name="hasProject"]:checked')?.value,
        readyToPresent: readyToPresent.current.querySelector('input[name="readyToPresent"]:checked')?.value,
        submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
        hasSsefProject: hasSsefProject.current.querySelector('input[name="hasSsefProject"]:checked')?.value,
      }),
    });
    const data = await res.json();
    setTempData(data);
  };
  
  
  const handleEdit = async (rowData) => {
    const updatedData = await showStudentAlert('Edit Details', rowData);
  
    if (updatedData) {
      const res = await fetch('/api/edit/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
  
      if (res.ok) {
        const res2 = await fetch('/api/search/student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            year: filterYear.current.value,
            hasPublication: hasPublication.current.querySelector('input[name="hasPublication"]:checked')?.value,
            hasProject: hasProject.current.querySelector('input[name="hasProject"]:checked')?.value,
            readyToPresent: readyToPresent.current.querySelector('input[name="readyToPresent"]:checked')?.value,
            submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
            hasSsefProject: hasSsefProject.current.querySelector('input[name="hasSsefProject"]:checked')?.value
          }),
        });
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  };
  
  const handleDelete = async (studentid) => {
    const confirm = await showAlert('Are you sure you want to delete?');
    if (confirm) {
      const res = await fetch('/api/delete/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentid })
      });

      if (res.ok) {
        const res2 = await fetch('/api/search/student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            search: searchBar.current.value,
            year: filterYear.current.value,
            hasPublication: hasPublication.current.querySelector('input[name="hasPublication"]:checked')?.value,
            hasProject: hasProject.current.querySelector('input[name="hasProject"]:checked')?.value,
            readyToPresent: readyToPresent.current.querySelector('input[name="readyToPresent"]:checked')?.value,
            submittedPoster: submittedPoster.current.querySelector('input[name="submittedPoster"]:checked')?.value,
            hasSsefProject: hasSsefProject.current.querySelector('input[name="hasSsefProject"]:checked')?.value
          })});
        const newdata = await res2.json();
        setTempData(newdata);
      }
    }
  }

  return (
    <div id="outer-div">
      <div id="filter-options">
        <b id="filter-title">Filters</b>

        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin", marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Year of Study:</b>
          <select ref={filterYear} onChange={handleSearch}>
            <option value="">None</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>

        <div style={{ marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Has Publication:</b>
            <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }} ref={hasPublication}>
            <label><input type="radio" name="hasPublication" value="true" onChange={handleSearch} /> ✅</label>
            <label><input type="radio" name="hasPublication" value="false" onChange={handleSearch} /> ❌</label>
            <label><input type="radio" name="hasPublication" value="" onChange={handleSearch} defaultChecked /> Any</label>
          </div>
        </div>

        <div style={{ marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Has Project:</b>
          <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }} ref={hasProject}>
            <label><input type="radio" name="hasProject" value="true" onChange={handleSearch} />✅</label>
            <label><input type="radio" name="hasProject" value="false" onChange={handleSearch} />❌</label>
            <label><input type="radio" name="hasProject" value="" onChange={handleSearch} defaultChecked />Any</label>
          </div>
        </div>

        <div style={{ marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Ready to Present:</b>
          <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }} ref={readyToPresent}>
            <label>
              <input type="radio" name="readyToPresent" value="true" onChange={handleSearch} />✅</label>
            <label><input type="radio" name="readyToPresent" value="false" onChange={handleSearch} />❌</label>
            <label><input type="radio" name="readyToPresent" value="" onChange={handleSearch} defaultChecked />Any</label>
          </div>
        </div>

        <div style={{ marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Submitted Poster:</b>
          <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }} ref={submittedPoster}>
            <label><input type="radio" name="submittedPoster" value="true" onChange={handleSearch} />✅</label>
            <label><input type="radio" name="submittedPoster" value="false" onChange={handleSearch} />❌</label>
            <label><input type="radio" name="submittedPoster" value="" onChange={handleSearch} defaultChecked />Any</label>
          </div>
        </div>

        <div style={{ marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin" }}>Has SSEF Project:</b>
          <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }} ref={hasSsefProject}>
            <label><input type="radio" name="hasSsefProject" value="true" onChange={handleSearch} />✅</label>
            <label><input type="radio" name="hasSsefProject" value="false" onChange={handleSearch} />❌</label>
            <label><input type="radio" name="hasSsefProject" value="" onChange={handleSearch} defaultChecked />Any</label>
          </div>
        </div>
      </div>

      <div id='search-div'>
        <button onClick={ handleAdd }><img src="add_icon.png" alt="Icon" style={{ width: '4vmin', height: '4vmin' }}  /></button>
        <b id='table-title'>Students</b>
        <input id="search-input" type="text" placeholder="Search" onChange={ handleSearch } ref={ searchBar }/>

        <p style={{marginTop: '1vmin', fontSize: "2vmin", textAlign: "end"}}>{tempData.length} record{tempData.length === 1 ? '' : 's'} found</p>
        <div id="table-container">
          <table id="table">
            <thead>
              <tr id="column-names">
                <th>Student ID</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Year</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tempData.map((tabledata, index) => (
                <tr key={tabledata.studentid} id={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td>{tabledata.studentid}</td>
                  <td>{tabledata.fname}</td>
                  <td>{tabledata.lname}</td>
                  <td>{tabledata.year_of_study}</td>
                  <td><button onClick={() => handleEdit(tabledata)}><img src="edit_icon.png" alt="Icon" style={{ width: '2vmin', height: '2vmin' }} /></button></td>
                  <td><button onClick={() => handleDelete(tabledata.studentid)}><img src="delete_icon.png" alt="Icon" style={{ width: '2.5vmin', height: '2.5vmin' }}  /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
        body: JSON.stringify({})
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
    <div id="outer-div">
      <div id='filter-options'>
        <b id='filter-title'>Filters</b>
        <b style={{ fontSize: "2vmin", width: "100%"}}>Publication date between</b>
        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }}>
          <p style={{ fontSize: "2vmin"  }}>Start date:</p>
          <input type="date" style={{ fontSize: "2vmin", fontFamily: "Courier New, Courier, monospace", border: '0.1vmin solid #707070', borderRadius: '0.6vmin' }} ref={startDate} onChange={handleSearch}/>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin" }}>
          <p style={{ fontSize: "2vmin" }}>End date:</p>
          <input type="date" style={{ fontSize: "2vmin", fontFamily: "Courier New, Courier, monospace", border: '0.1vmin solid #707070', borderRadius: '0.6vmin' }} ref={endDate} onChange={handleSearch}/>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "1vmin", marginTop: "2vmin" }}>
          <b style={{ fontSize: "2vmin"}}>Field of Study:</b>
          <select onChange={handleSearch} ref={fieldOfStudy}>
            <option value=''>None</option>
            <option value="AI & Healthcare">AI & Healthcare</option>
            <option value="Blockchain">Blockchain</option>
            <option value="IoT">IoT</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>
      </div>

      <div id='search-div'>
        <button onClick={ handleAdd }><img src="add_icon.png" alt="Icon" style={{ width: '4vmin', height: '4vmin' }}  /></button>
        <b id='table-title'>Publications</b>
        <input id="search-input" type="text" placeholder="Search" onChange={ handleSearch } ref={ searchBar }/>

        <p style={{marginTop: '1vmin', fontSize: "2vmin", textAlign: "end"}}>{tempData.length} record{tempData.length === 1 ? '' : 's'} found</p>
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
                <th>Edit</th>
                <th>Delete</th>
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
                  <td style={{ textAlign: "center"}}><button onClick={() => handleEdit(tabledata)}><img src="edit_icon.png" alt="Icon" style={{ width: '2vmin', height: '2vmin' }} /></button></td>
                  <td style={{ textAlign: "center"}}><button onClick={() => handleDelete(tabledata.link)}><img src="delete_icon.png" alt="Icon" style={{ width: '2.5vmin', height: '2.5vmin' }}  /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}