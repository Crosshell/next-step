import { Vacancy } from '../types/vacancy';

const vacanciesData: Vacancy[] = [
  {
    id: 'vacancy-123',
    title: 'Frontend Developer',
    description: `          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
          possimus quis repudiandae ex. Nam vitae obcaecati corrupti
          voluptatibus facere ratione mollitia ad aspernatur, in expedita natus
          inventore ipsa aliquam reprehenderit. Voluptatum corporis
          necessitatibus recusandae? Sint, illo! Suscipit minus autem assumenda
          consequatur facilis, velit hic iure temporibus neque culpa sequi
          praesentium, cum, saepe excepturi minima. Corporis, consectetur.
          Ratione corrupti illum blanditiis. Repellendus animi vero omnis
          maiores doloribus, dolorem autem temporibus architecto eius blanditiis
          ipsa quidem quo explicabo culpa exercitationem fugiat quia dolor
          deleniti eos sunt odit vitae! Voluptatum ut quasi minima. Minima
          maxime vero ab nemo voluptates ullam. Libero adipisci accusantium
          sequi non laboriosam eum! Distinctio fugiat explicabo a nobis, odio
          officia voluptatum, modi tempore adipisci deserunt, quia alias sed
          provident! Mollitia, autem. Quod ipsam aspernatur molestiae cupiditate
          adipisci sed! Obcaecati saepe tempora repudiandae qui consectetur
          amet, reiciendis molestiae eius. Molestiae voluptatem sequi
          voluptatibus molestias doloribus earum amet vitae magni aut!
          Necessitatibus aperiam itaque quia quidem cumque cum quo repellat aut,
          expedita accusantium ab? Repellendus, ab est sint aut dicta facilis
          repudiandae cupiditate ut dolor temporibus doloremque nulla alias enim
          sapiente? Mollitia blanditiis illum repudiandae officiis, unde, enim
          dolores rerum et doloremque laborum iusto laudantium itaque est
          tenetur sunt. Molestias error dolor labore nesciunt possimus.
          Repellendus iure officia voluptates corrupti rerum! Beatae, fugit cum.
          Recusandae voluptatibus obcaecati in? Ab dicta officia sint ea
          mollitia pariatur, laudantium magni placeat. Quam dignissimos sint
          suscipit repellendus quis quos error ipsa, porro quibusdam. Nisi,
          eveniet. Recusandae vel molestiae mollitia! Provident qui atque
          molestiae, animi veniam repellendus amet dolor velit beatae aliquid
          harum dolore quisquam esse numquam reprehenderit ea, doloremque id
          corporis tenetur inventore aut. Voluptatem! Nulla, aperiam repellat.
          Aut rem minima accusamus voluptate cumque. Officia tempora, commodi
          assumaliquam illo molestias distinctio neque
          porro officiis aperiam explicabo ab perspiciatis incidunt corporis
          quis voluptatum. Incidunt!`,
    work_format: 'Remote',
    office_location: 'Kyiv, Ukraine',
    experience_required: 2,
    employment_type: 'Full-time',
    views: 128,
    is_active: true,
    seniority_level: 'Mid',
    company_name: 'A Coolompany ',
    company_site: 'https://www.techcorp.com',
    archived_at: new Date('2025-04-01T00:00:00Z'),
    created_at: new Date('2025-03-01T12:00:00Z'),
    edited_at: new Date('2025-04-04T15:30:00Z'),
  },

  {
    id: 'vacancy-124',
    title: 'Backend Engineer',
    description:
      'Join our team to build scalable backend services using Node.js and PostgreSQL.',
    work_format: 'Hybrid',
    office_location: 'Lviv, Ukraine',
    experience_required: 3,
    employment_type: 'Full-time',
    views: 210,
    is_active: true,
    seniority_level: 'Senior',
    company_name: 'Company-789',
    company_site: 'https://www.techcorp.com',
    archived_at: new Date('2025-04-01T00:00:00Z'),
    created_at: new Date('2025-02-20T09:00:00Z'),
    edited_at: new Date('2025-04-03T11:15:00Z'),
  },

  {
    id: 'vacancy-125',
    title: 'UI/UX Designer',
    description:
      'Looking for a creative designer with strong Figma skills and an eye for detail.',
    work_format: 'On-site',
    office_location: 'Odesa, Ukraine',
    experience_required: 1,
    employment_type: 'Part-time',
    views: 87,
    is_active: false,
    seniority_level: 'Junior',
    company_name: 'ChipiChipi Company',
    company_site: 'https://www.techcorp.com',

    archived_at: new Date('2025-03-25T00:00:00Z'),
    created_at: new Date('2025-01-15T08:30:00Z'),
    edited_at: new Date('2025-03-10T14:45:00Z'),
  },
];

export { vacanciesData };
