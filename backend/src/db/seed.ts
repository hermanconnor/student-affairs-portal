import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';
import { env } from '../config/env';

const client = postgres(env.DATABASE_URL);
const db = drizzle(client, { schema });

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // 1. Wipe existing entries in strict reverse-dependency order
    // Using explicit table executions handles truncation smoothly
    await db.delete(schema.requestComment);
    await db.delete(schema.request);
    await db.delete(schema.registration);
    await db.delete(schema.event);
    await db.delete(schema.account);
    await db.delete(schema.session);
    await db.delete(schema.verification);
    await db.delete(schema.user);

    console.log('✓ Database cleaned');

    // 2. Demo users — one per role
    await db.insert(schema.user).values([
      {
        id: 'user_admin_01',
        name: 'Admin User',
        email: 'admin@university.edu',
        emailVerified: true,
        role: 'admin',
      },
      {
        id: 'user_advisor_01',
        name: 'Advisor User',
        email: 'advisor@university.edu',
        emailVerified: true,
        role: 'advisor',
      },
      {
        id: 'user_student_01',
        name: 'Student User',
        email: 'student@university.edu',
        emailVerified: true,
        role: 'student',
      },
    ]);

    console.log('✓ Users seeded');

    // 3. Events
    await db.insert(schema.event).values([
      {
        id: 'event_01',
        title: 'Fall Welcome Mixer',
        description: 'Annual welcome event for all students.',
        location: 'Student Union Ballroom',
        date: new Date('2026-09-05T18:00:00Z'),
        createdBy: 'user_admin_01',
        status: 'published',
      },
      {
        id: 'event_02',
        title: 'Leadership Workshop',
        description: 'A workshop on student leadership skills.',
        location: 'Room 204, Admin Building',
        date: new Date('2026-09-12T14:00:00Z'),
        createdBy: 'user_admin_01',
        status: 'published',
      },
      {
        id: 'event_03',
        title: 'Career Fair Prep Session',
        description: 'Resume review and interview tips.',
        location: 'Library Conference Room',
        date: new Date('2026-09-20T10:00:00Z'),
        createdBy: 'user_admin_01',
        status: 'draft',
      },
    ]);

    console.log('✓ Events seeded');

    // 4. Registrations
    await db.insert(schema.registration).values([
      {
        id: 'reg_01',
        userId: 'user_student_01',
        eventId: 'event_01',
        checkedIn: true,
      },
      {
        id: 'reg_02',
        userId: 'user_student_01',
        eventId: 'event_02',
        checkedIn: false,
      },
    ]);

    console.log('✓ Registrations seeded');

    // 5. Requests matching complex multi-stage approvals
    await db.insert(schema.request).values([
      {
        id: 'req_01',
        title: 'Spring Cultural Night Funding',
        description: 'Requesting $500 for cultural night event expenses.',
        type: 'funding',
        submittedBy: 'user_student_01',
        advisorStatus: 'approved',
        adminStatus: 'pending',
      },
      {
        id: 'req_02',
        title: 'Club Meeting Room Reservation',
        description: 'Weekly room reservation for the debate club.',
        type: 'room_reservation',
        submittedBy: 'user_student_01',
        advisorStatus: 'pending',
        adminStatus: 'pending',
      },
      {
        id: 'req_03',
        title: 'End of Year Celebration',
        description: 'Proposing an end-of-year celebration event.',
        type: 'event',
        submittedBy: 'user_student_01',
        advisorStatus: 'revision_requested',
        adminStatus: 'pending',
      },
    ]);

    console.log('✓ Requests seeded');

    // 6. Comments
    await db.insert(schema.requestComment).values([
      {
        id: 'comment_01',
        requestId: 'req_01',
        userId: 'user_advisor_01',
        comment:
          'Looks good. Approved and forwarded to admin for final review.',
      },
    ]);

    console.log('✓ Comments seeded');
    console.log('\n🚀 Seed operation complete. Available Profiles:');
    console.log('  admin@university.edu   → role: admin');
    console.log('  advisor@university.edu → role: advisor');
    console.log('  student@university.edu → role: student');
  } catch (error) {
    console.error('❌ Data seed process encountered an error:', error);
    process.exit(1);
  } finally {
    // Explicitly shut down postgres connection pool instance
    await client.end();
  }
}

await seed();
