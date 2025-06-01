import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';
import { User, Agent, Employee, Question } from '@/lib/models';

export async function GET() {
  try {
    const startTime = Date.now();

    // Test database connection
    const dbConnected = await testConnection();

    // Get basic counts to verify database is working
    const [userCount, agentCount, employeeCount, questionCount] = await Promise.all([
      User.count().catch(() => 0),
      Agent.count().catch(() => 0),
      Employee.count().catch(() => 0),
      Question.count().catch(() => 0)
    ]);

    const responseTime = Date.now() - startTime;

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      database: {
        connected: dbConnected,
        users: userCount,
        agents: agentCount,
        employees: employeeCount,
        questions: questionCount
      },
      services: {
        api: 'healthy',
        auth: 'healthy',
        database: dbConnected ? 'healthy' : 'unhealthy'
      }
    };

    const statusCode = dbConnected ? 200 : 503;

    return NextResponse.json(healthData, { status: statusCode });

  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      error: error.message,
      services: {
        api: 'healthy',
        auth: 'unknown',
        database: 'unhealthy'
      }
    }, { status: 503 });
  }
}