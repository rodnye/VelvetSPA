import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { plansTable, servicesTable, usersTable } from './schema';

async function seed() {
  const db = drizzle(
    process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:13456/postgres',
  );

  await db
    .insert(usersTable)
    .values([
      {
        name: 'Administrador',
        email: 'admin@velvetspa.com',
        password: await bcrypt.hash('admin1234', 10),
        role: 'admin',
      },
      {
        name: 'Empleada Demo',
        email: 'empleada@velvetspa.com',
        password: await bcrypt.hash('empleada1234', 10),
        role: 'employee',
      },
      {
        name: 'Cliente Demo',
        email: 'cliente@velvetspa.com',
        password: await bcrypt.hash('cliente1234', 10),
        role: 'client',
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(servicesTable)
    .values([
      // ─── Faciales ───────────────────────────────────────────────
      {
        name: 'Limpieza facial',
        description: 'Limpieza profunda del rostro.',
        category: 'faciales',
        durationMin: 45,
        price: '20.00',
      },
      {
        name: 'Tratamiento Nanquador',
        description: 'Tratamiento facial Nanquador.',
        category: 'faciales',
        durationMin: 30,
        price: '10.00',
      },
      {
        name: 'Hidratación profunda-PV',
        description: 'Hidratación profunda con productos especializados.',
        category: 'faciales',
        durationMin: 30,
        price: '15.00',
      },
      {
        name: 'Exfoliación facial',
        description: 'Exfoliación suave para renovar la piel del rostro.',
        category: 'faciales',
        durationMin: 20,
        price: '5.00',
      },
      {
        name: 'Definición de cejas',
        description: 'Perfilado y definición de cejas.',
        category: 'faciales',
        durationMin: 15,
        price: '2.00',
      },
      {
        name: 'Tratamiento con máscara LED',
        description:
          'Máscara LED con opciones hidratantes, revitalizantes o antiacné.',
        category: 'faciales',
        durationMin: 30,
        price: '10.00',
      },
      {
        name: 'Tinte de cejas',
        description: 'Coloración y tinte de cejas.',
        category: 'faciales',
        durationMin: 15,
        price: '5.00',
      },
      {
        name: 'Microdermoabrasión',
        description:
          'Exfoliación mecánica para renovar la capa superficial de la piel.',
        category: 'faciales',
        durationMin: 30,
        price: '15.00',
      },
      {
        name: 'Masaje Kobido',
        description: 'Masaje facial japonés de lifting natural.',
        category: 'faciales',
        durationMin: 30,
        price: '15.00',
      },

      // ─── Dermapen ───────────────────────────────────────────────
      {
        name: 'Dermapen - Masaje con aceite',
        description: 'Masaje con aceite de argán, coco, sésamo o moringa.',
        category: 'dermapen',
        durationMin: 30,
        price: '15.00',
      },
      {
        name: 'Dermapen - Rostro, Cuello, Escote, Abdomen, Glúteos, Muslos',
        description:
          'Tratamiento Dermapen en rostro, cuello, escote, abdomen, glúteos y muslos.',
        category: 'dermapen',
        durationMin: 60,
        price: '30.00',
      },
      {
        name: 'Dermapen - Micro Cobos Piernas, Rodillas, Bikini, Micriona',
        description:
          'Tratamiento Dermapen en piernas, rodillas, bikini y micriona.',
        category: 'dermapen',
        durationMin: 45,
        price: '20.00',
      },

      // ─── Masajes corporales ─────────────────────────────────────
      {
        name: 'Masaje Relajante',
        description:
          'Masaje corporal completo para relajación profunda. La adición de aceites esenciales tiene un costo extra de 5 USD.',
        category: 'masajes_corporales',
        durationMin: 60,
        price: '20.00',
      },
      {
        name: 'Masaje con Piedras Calientes',
        description:
          'Terapia con piedras volcánicas calientes para aliviar tensiones musculares.',
        category: 'masajes_corporales',
        durationMin: 60,
        price: '25.00',
      },
      {
        name: 'Masaje Descontracturante',
        description:
          'Masaje profundo enfocado en liberar contracturas y nudos musculares.',
        category: 'masajes_corporales',
        durationMin: 60,
        price: '30.00',
      },
      {
        name: 'Drenaje Linfático',
        description:
          'Masaje suave que estimula el sistema linfático para eliminar toxinas.',
        category: 'masajes_corporales',
        durationMin: 60,
        price: '30.00',
      },
      {
        name: 'Masaje Deportivo',
        description:
          'Masaje orientado a la recuperación y preparación muscular deportiva.',
        category: 'masajes_corporales',
        durationMin: 60,
        price: '30.00',
      },
      {
        name: 'Masaje Energético',
        description: 'Masaje holístico para equilibrar la energía del cuerpo.',
        category: 'masajes_corporales',
        durationMin: 60,
        price: '35.00',
      },
      {
        name: 'Masaje Reductor Localizado',
        description:
          'Masaje enfocado en zonas específicas para reducir medidas.',
        category: 'masajes_corporales',
        durationMin: 45,
        price: '25.00',
      },
      {
        name: 'Combinado Relajante + Reductor Localizado',
        description:
          'Sesión combinada de masaje relajante y reductor localizado.',
        category: 'masajes_corporales',
        durationMin: 60,
        price: '30.00',
      },
      {
        name: 'Masaje Capilar',
        description: 'Masaje relajante en cuero cabelludo.',
        category: 'masajes_corporales',
        durationMin: 30,
        price: '10.00',
      },
      {
        name: 'Masaje Relajante Podal',
        description: 'Masaje relajante enfocado en pies y piernas.',
        category: 'masajes_corporales',
        durationMin: 30,
        price: '15.00',
      },
      {
        name: 'Mudoterapia Localizada (Abdomen, Glúteos, Muslos)',
        description:
          'Aplicación de lodos termales en abdomen, glúteos y muslos.',
        category: 'masajes_corporales',
        durationMin: 30,
        price: '30.00',
      },
      {
        name: 'Mudoterapia Localizada Brazos',
        description: 'Aplicación de lodos termales en brazos.',
        category: 'masajes_corporales',
        durationMin: 30,
        price: '15.00',
      },
      {
        name: 'Masaje en Pareja',
        description: 'Sesión de masaje simultánea para dos personas.',
        category: 'masajes_corporales',
        durationMin: 60,
        price: '50.00',
      },

      // ─── Depilación ─────────────────────────────────────────────
      {
        name: 'Depilación Pubis, Abdomen o Glúteos (c/u)',
        description: 'Depilación de zona íntima, abdomen o glúteos (por zona).',
        category: 'depilacion',
        durationMin: 30,
        price: '10.00',
      },
      {
        name: 'Depilación Facial o Extremidades pequeñas (c/u)',
        description:
          'Depilación de barbilla, patillas, cuello, bozo, nariz, orejas, manos o pies (por zona).',
        category: 'depilacion',
        durationMin: 10,
        price: '2.00',
      },
      {
        name: 'Depilación Brazos, Muslos o Piernas (c/u)',
        description: 'Depilación de brazos, muslos o piernas (por zona).',
        category: 'depilacion',
        durationMin: 20,
        price: '8.00',
      },
      {
        name: 'Depilación Bikini o Axilas (c/u)',
        description: 'Depilación de zona bikini o axilas (por zona).',
        category: 'depilacion',
        durationMin: 15,
        price: '5.00',
      },
      {
        name: 'Depilación Espalda o Torso (c/u)',
        description: 'Depilación de espalda o torso (por zona).',
        category: 'depilacion',
        durationMin: 30,
        price: '10.00',
      },
      {
        name: 'Depilación Piernas Completas',
        description: 'Depilación completa de ambas piernas.',
        category: 'depilacion',
        durationMin: 40,
        price: '20.00',
      },

      // ─── Corporales ─────────────────────────────────────────────
      {
        name: 'Tratamiento Anticelulítico',
        description: 'Tratamiento corporal enfocado en reducir la celulitis.',
        category: 'corporales',
        durationMin: 30,
        price: '15.00',
      },
      {
        name: 'Exfoliación Corporal',
        description: 'Exfoliación completa del cuerpo para renovar la piel.',
        category: 'corporales',
        durationMin: 30,
        price: '10.00',
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(plansTable)
    .values([
      {
        name: 'Plan Básico',
        description: 'Acceso al circuito termal durante un mes.',
        price: '45.00',
        durationDays: 30,
      },
      {
        name: 'Plan Premium',
        description: 'Termal ilimitado + 2 masajes al mes, durante 3 meses.',
        price: '120.00',
        durationDays: 90,
      },
      {
        name: 'Plan Anual VIP',
        description: 'Todos los servicios con 20% de descuento durante un año.',
        price: '400.00',
        durationDays: 365,
      },
    ])
    .onConflictDoNothing();

  console.log('Seed completado: usuarios, servicios y planes creados.');
  process.exit(0);
}

void seed();
