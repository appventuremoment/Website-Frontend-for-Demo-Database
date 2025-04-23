import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { search, field_of_study, submittedForms, submittedPoster, ssefResult, industryFilter } = await req.json();
  
  try {
    let sql = `
      SELECT ssef.*, proj.title, proj.field_of_study
      FROM ssef_project ssef
      JOIN project proj ON ssef.pid = proj.internal_code
      WHERE 1=1
    `;

    const params: any[] = [];
    if (search) {
      sql += ` AND (
        proj.title LIKE ? OR 
        proj.field_of_study LIKE ? OR 
        ssef.ssef_code LIKE ? OR
        ssef.forms_received LIKE ? OR
        ssef.poster_received LIKE ? OR
        ssef.result LIKE ?
      )`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam, searchParam, searchParam);
    }

    if (field_of_study) {
      sql += ` AND proj.field_of_study LIKE ?`;
      params.push(`%${field_of_study}%`);
    }

    const submittedPosterBool = submittedPoster === 'true' ? true : submittedPoster === 'false' ? false : undefined;
    const submittedFormsBool = submittedForms === 'true' ? true : submittedForms === 'false' ? false : undefined;

    if (submittedFormsBool !== undefined) {
      sql += ` AND ssef.forms_received = ?`
      params.push(submittedFormsBool);
    }

    if (submittedPosterBool !== undefined) {
      sql += ` AND ssef.poster_received = ?`;
      params.push(submittedPosterBool);
    }

    if (ssefResult) {
      sql += ` AND ssef.result LIKE ?`;
      params.push(`%${ssefResult}%`);
    }

    if (industryFilter) {
      sql += ` AND ssef.pid IN (
        SELECT proj.internal_code
        FROM project proj
        JOIN external_company extc ON proj.ecompany_name = extc.company_name
        WHERE extc.industry LIKE ?
      )`;
      params.push(`%${industryFilter}%`);
    }
    
    const results = await prisma.$queryRawUnsafe(sql, ...params);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json([], { status: 500 });
  }
}