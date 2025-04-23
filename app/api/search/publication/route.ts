import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { search, field_of_study, startDate, endDate } = await req.json()
  
  try {
    let sql = `
      SELECT pub.*, proj.title, proj.field_of_study
      FROM publication pub
      LEFT JOIN project proj ON pub.pid = proj.internal_code
      WHERE 1=1
    `
    
    const params: any[] = []
    if (search) {
      sql += ` AND (
        pub.journal LIKE ? OR 
        pub.link LIKE ? OR 
        pub.publisher LIKE ? OR 
        pub.pid LIKE ? OR
        proj.title LIKE ?
      )`
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam, searchParam, searchParam)
    }
    
    if (field_of_study) {
      sql += ` AND proj.field_of_study LIKE ?`
      params.push(`%${field_of_study}%`)
    }
    
    if (startDate) {
      sql += ` AND pub.publication_date >= ?`
      params.push(new Date(startDate))
    }
    
    if (endDate) {
      sql += ` AND pub.publication_date <= ?`
      params.push(new Date(endDate))
    }
    
    const results = await prisma.$queryRawUnsafe(sql, ...params)
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Database query error:', error)
    return NextResponse.json([], { status: 500 })
  }
}