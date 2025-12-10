import { scenario } from 'k6/execution';
import { options, BASE_URL } from './options.js';
import { runAuthFlow } from './flows/auth-flow.js';
import { runJobSeekerFlow } from './flows/job-seeker-flow.js';
import { runRecruiterFlow } from './flows/recruiter-flow.js';
import { runSearchVacanciesFlow } from './flows/search-vacancies-flow.js';

export { options };

export default function () {
  switch (scenario.name) {
    case 'auth_flow':
      runAuthFlow(BASE_URL);
      break;
    case 'job_seeker_flow':
      runJobSeekerFlow(BASE_URL);
      break;
    case 'recruiter_flow':
      runRecruiterFlow(BASE_URL);
      break;
    case 'search_vacancies_flow':
      runSearchVacanciesFlow(BASE_URL);
      break;
    default:
      console.error(`Unknown scenario: ${scenario.name}`);
  }
}
