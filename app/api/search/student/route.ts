import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { search, year, hasPublication, hasProject, readyToPresent, submittedPoster, hasSsefProject } = await req.json();

  try {
    let sql = `
      SELECT stu.* 
      FROM student stu
      WHERE 1=1
    `;

    const params: any[] = [];
    if (year) {
      sql += ` AND stu.year_of_study = ?`;
      params.push(year);
    }

    if (search) {
      sql += ` AND (
        stu.studentid LIKE ? OR 
        stu.fname LIKE ? OR 
        stu.lname LIKE ? OR 
        stu.year_of_study LIKE ?
      )`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    const hasPublicationBool = hasPublication === 'true' ? true : hasPublication === 'false' ? false : undefined;
    const hasProjectBool = hasProject === 'true' ? true : hasProject === 'false' ? false : undefined;
    const readyToPresentBool = readyToPresent === 'true' ? true : readyToPresent === 'false' ? false : undefined;
    const submittedPosterBool = submittedPoster === 'true' ? true : submittedPoster === 'false' ? false : undefined;
    const hasSsefProjectBool = hasSsefProject === 'true' ? true : hasSsefProject === 'false' ? false : undefined;

    if (hasPublicationBool !== undefined) {
      sql += ` AND stu.studentid ${hasPublicationBool ? '' : 'NOT'} IN (
        SELECT sp.studentid
        FROM student_project sp
        JOIN project proj ON sp.internal_code = proj.internal_code
        JOIN publication pub ON proj.internal_code = pub.pid
      )`;
    }

    if (hasProjectBool !== undefined) {
      sql += ` AND stu.studentid ${hasProjectBool ? '' : 'NOT'} IN (
        SELECT sp.studentid
        FROM student_project sp
        JOIN project proj ON sp.internal_code = proj.internal_code
      )`;
    }

    if (readyToPresentBool !== undefined) {
      sql += ` AND stu.studentid ${readyToPresentBool ? '' : 'NOT'} IN (
        SELECT sp.studentid
        FROM student_project sp
        JOIN project proj ON sp.internal_code = proj.internal_code
        WHERE proj.present_ready = true
      )`;
    }

    if (submittedPosterBool !== undefined) {
      sql += ` AND stu.studentid ${submittedPosterBool ? '' : 'NOT'} IN (
        SELECT sp.studentid
        FROM student_project sp
        JOIN project proj ON sp.internal_code = proj.internal_code
        WHERE proj.poster_received = true
      )`;
    }

    if (hasSsefProjectBool !== undefined) {
      sql += ` AND stu.studentid ${hasSsefProjectBool ? '' : 'NOT'} IN (
        SELECT sp.studentid
        FROM student_project sp
        JOIN project proj ON sp.internal_code = proj.internal_code
        JOIN ssef_project ssef ON proj.internal_code = ssef.pid
      )`;
    }
    
    const results = await prisma.$queryRawUnsafe(sql, ...params);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json([], { status: 500 });
  }
}