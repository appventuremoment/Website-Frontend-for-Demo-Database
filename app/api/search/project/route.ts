import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { search, taken, field_of_study, readyToPresent, submittedPoster, industryFilter, externalCompany } = await req.json();

  try {
    let sql = `
      SELECT proj.*, 
            extc.company_name,
            extc.industry,
            ssef.ssef_code
      FROM project proj
      LEFT JOIN external_company extc ON proj.ecompany_name = extc.company_name
      LEFT JOIN ssef_project ssef ON proj.internal_code = ssef.pid
      WHERE 1=1
    `;

    const params: any[] = [];

    if (search) {
      sql += ` AND (
        proj.internal_code LIKE ? OR 
        proj.title LIKE ? OR 
        proj.field_of_study LIKE ? OR 
        proj.taken LIKE ? OR 
        proj.present_ready LIKE ? OR 
        proj.poster_received LIKE ? OR 
        proj.EMemail LIKE ? OR 
        proj.IMemail LIKE ? OR 
        extc.company_name LIKE ? OR 
        extc.industry LIKE ? OR 
        ssef.ssef_code LIKE ?
      )`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam, searchParam, searchParam, searchParam, searchParam, searchParam, searchParam, searchParam);
    }

    const takenBool = taken === 'true' ? true : taken === 'false' ? false : undefined;
    const readyToPresentBool = readyToPresent === 'true' ? true : readyToPresent === 'false' ? false : undefined;
    const submittedPosterBool = submittedPoster === 'true' ? true : submittedPoster === 'false' ? false : undefined;

    if (takenBool !== undefined) {
        sql += ` AND proj.taken LIKE ?`;
        params.push(takenBool);
    }

    if (field_of_study) {
      sql += ` AND proj.field_of_study LIKE ?`;
      params.push(`%${field_of_study}%`);
    }

    if (readyToPresentBool !== undefined) {
        sql += ` AND proj.present_ready LIKE ?`;
        params.push(readyToPresentBool);
    }

    if (submittedPosterBool !== undefined) {
        sql += ` AND proj.poster_received LIKE ?`;
        params.push(submittedPosterBool);
    }

    if (industryFilter) {
      sql += ` AND extc.industry = ?`;
      params.push(industryFilter);
    }
    
    if (externalCompany) {
        sql += ` AND extc.company_name LIKE ?`;
        params.push(`%${externalCompany}%`);
    }

    const results = await prisma.$queryRawUnsafe(sql, ...params);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json([], { status: 500 });
  }
}