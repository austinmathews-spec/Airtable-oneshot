import { v4 as uuid } from 'uuid';
import type { Base } from '../types';

function createSampleBase(): Base {
  const table1Fields = [
    { id: 'fld_name', name: 'Name', type: 'singleLineText' as const, width: 260, isPrimary: true },
    { id: 'fld_notes', name: 'Notes', type: 'multilineText' as const, width: 200 },
    { id: 'fld_assignee', name: 'Assignee', type: 'singleSelect' as const, width: 150, options: [
      { id: 'opt1', name: 'Cameron Toth', color: 'cyanLight' },
      { id: 'opt2', name: 'Leslie Alexander', color: 'pinkLight' },
      { id: 'opt3', name: 'Jordan Walke', color: 'purpleLight' },
      { id: 'opt4', name: 'Bailey Kuehn', color: 'orangeLight' },
    ]},
    { id: 'fld_status', name: 'Status', type: 'singleSelect' as const, width: 150, options: [
      { id: 'sts1', name: 'Todo', color: 'redLight' },
      { id: 'sts2', name: 'In progress', color: 'yellowLight' },
      { id: 'sts3', name: 'Done', color: 'greenLight' },
    ]},
    { id: 'fld_priority', name: 'Priority', type: 'singleSelect' as const, width: 130, options: [
      { id: 'pri1', name: 'Low', color: 'blueLight' },
      { id: 'pri2', name: 'Medium', color: 'yellowLight' },
      { id: 'pri3', name: 'High', color: 'orangeLight' },
      { id: 'pri4', name: 'Critical', color: 'redLight' },
    ]},
    { id: 'fld_tags', name: 'Tags', type: 'multipleSelects' as const, width: 200, options: [
      { id: 'tag1', name: 'Bug', color: 'red' },
      { id: 'tag2', name: 'Feature', color: 'blue' },
      { id: 'tag3', name: 'Enhancement', color: 'green' },
      { id: 'tag4', name: 'Documentation', color: 'purple' },
      { id: 'tag5', name: 'Design', color: 'pink' },
    ]},
    { id: 'fld_due', name: 'Due date', type: 'date' as const, width: 140 },
    { id: 'fld_done', name: 'Complete', type: 'checkbox' as const, width: 100 },
    { id: 'fld_estimate', name: 'Estimate (hrs)', type: 'number' as const, width: 130 },
    { id: 'fld_email', name: 'Contact email', type: 'email' as const, width: 200 },
    { id: 'fld_url', name: 'Reference URL', type: 'url' as const, width: 200 },
    { id: 'fld_rating', name: 'Difficulty', type: 'rating' as const, width: 130 },
    { id: 'fld_phone', name: 'Phone', type: 'phone' as const, width: 150 },
    { id: 'fld_budget', name: 'Budget', type: 'currency' as const, width: 130 },
    { id: 'fld_progress', name: 'Progress', type: 'percent' as const, width: 120 },
  ];

  const table1Records = [
    { id: uuid(), cells: { fld_name: 'Design new landing page', fld_notes: 'Create a modern, responsive landing page for the new product launch', fld_assignee: 'Cameron Toth', fld_status: 'In progress', fld_priority: 'High', fld_tags: ['Design', 'Feature'], fld_due: '2026-06-20', fld_done: false, fld_estimate: 16, fld_email: 'cameron@example.com', fld_url: 'https://figma.com/design', fld_rating: 4, fld_phone: '(555) 123-4567', fld_budget: 5000, fld_progress: 0.65 }, createdTime: '2026-06-01T10:00:00Z' },
    { id: uuid(), cells: { fld_name: 'Fix authentication bug', fld_notes: 'Users are being logged out randomly after 10 minutes of inactivity', fld_assignee: 'Jordan Walke', fld_status: 'Todo', fld_priority: 'Critical', fld_tags: ['Bug'], fld_due: '2026-06-15', fld_done: false, fld_estimate: 8, fld_email: 'jordan@example.com', fld_url: 'https://github.com/issues/142', fld_rating: 5, fld_phone: '(555) 234-5678', fld_budget: 2000, fld_progress: 0 }, createdTime: '2026-06-02T14:30:00Z' },
    { id: uuid(), cells: { fld_name: 'Write API documentation', fld_notes: 'Complete OpenAPI spec and developer guide for v2 endpoints', fld_assignee: 'Leslie Alexander', fld_status: 'In progress', fld_priority: 'Medium', fld_tags: ['Documentation'], fld_due: '2026-06-25', fld_done: false, fld_estimate: 24, fld_email: 'leslie@example.com', fld_url: 'https://docs.example.com', fld_rating: 3, fld_phone: '(555) 345-6789', fld_budget: 3000, fld_progress: 0.4 }, createdTime: '2026-06-03T09:15:00Z' },
    { id: uuid(), cells: { fld_name: 'Set up CI/CD pipeline', fld_notes: 'Configure GitHub Actions for automated testing and deployment', fld_assignee: 'Bailey Kuehn', fld_status: 'Done', fld_priority: 'High', fld_tags: ['Enhancement'], fld_due: '2026-06-10', fld_done: true, fld_estimate: 12, fld_email: 'bailey@example.com', fld_url: 'https://github.com/actions', fld_rating: 4, fld_phone: '(555) 456-7890', fld_budget: 1500, fld_progress: 1.0 }, createdTime: '2026-06-04T11:45:00Z' },
    { id: uuid(), cells: { fld_name: 'Implement dark mode', fld_notes: 'Add theme switching functionality with system preference detection', fld_assignee: 'Cameron Toth', fld_status: 'Todo', fld_priority: 'Low', fld_tags: ['Feature', 'Design'], fld_due: '2026-07-01', fld_done: false, fld_estimate: 20, fld_email: 'cameron@example.com', fld_url: '', fld_rating: 2, fld_phone: '(555) 123-4567', fld_budget: 4000, fld_progress: 0 }, createdTime: '2026-06-05T16:00:00Z' },
    { id: uuid(), cells: { fld_name: 'Performance optimization', fld_notes: 'Optimize database queries and reduce page load time by 50%', fld_assignee: 'Jordan Walke', fld_status: 'In progress', fld_priority: 'High', fld_tags: ['Enhancement'], fld_due: '2026-06-18', fld_done: false, fld_estimate: 30, fld_email: 'jordan@example.com', fld_url: 'https://webpagetest.org', fld_rating: 5, fld_phone: '(555) 234-5678', fld_budget: 6000, fld_progress: 0.3 }, createdTime: '2026-06-06T08:30:00Z' },
    { id: uuid(), cells: { fld_name: 'User onboarding flow', fld_notes: 'Design and implement step-by-step onboarding for new users', fld_assignee: 'Leslie Alexander', fld_status: 'Todo', fld_priority: 'Medium', fld_tags: ['Feature', 'Design'], fld_due: '2026-06-28', fld_done: false, fld_estimate: 16, fld_email: 'leslie@example.com', fld_url: '', fld_rating: 3, fld_phone: '(555) 345-6789', fld_budget: 3500, fld_progress: 0 }, createdTime: '2026-06-07T13:20:00Z' },
    { id: uuid(), cells: { fld_name: 'Mobile responsive refactor', fld_notes: 'Ensure all pages render correctly on mobile devices', fld_assignee: 'Bailey Kuehn', fld_status: 'Done', fld_priority: 'Medium', fld_tags: ['Enhancement', 'Design'], fld_due: '2026-06-12', fld_done: true, fld_estimate: 18, fld_email: 'bailey@example.com', fld_url: '', fld_rating: 3, fld_phone: '(555) 456-7890', fld_budget: 2500, fld_progress: 1.0 }, createdTime: '2026-06-08T10:10:00Z' },
    { id: uuid(), cells: { fld_name: 'Add search functionality', fld_notes: 'Implement full-text search with Elasticsearch integration', fld_assignee: 'Cameron Toth', fld_status: 'In progress', fld_priority: 'High', fld_tags: ['Feature'], fld_due: '2026-06-22', fld_done: false, fld_estimate: 24, fld_email: 'cameron@example.com', fld_url: 'https://elastic.co', fld_rating: 4, fld_phone: '(555) 123-4567', fld_budget: 8000, fld_progress: 0.5 }, createdTime: '2026-06-09T15:45:00Z' },
    { id: uuid(), cells: { fld_name: 'Security audit', fld_notes: 'Conduct comprehensive security review of authentication and data access patterns', fld_assignee: 'Jordan Walke', fld_status: 'Todo', fld_priority: 'Critical', fld_tags: ['Bug', 'Enhancement'], fld_due: '2026-06-16', fld_done: false, fld_estimate: 40, fld_email: 'jordan@example.com', fld_url: 'https://owasp.org', fld_rating: 5, fld_phone: '(555) 234-5678', fld_budget: 10000, fld_progress: 0 }, createdTime: '2026-06-10T09:00:00Z' },
  ];

  const table2Fields = [
    { id: 'fld2_name', name: 'Company', type: 'singleLineText' as const, width: 200, isPrimary: true },
    { id: 'fld2_contact', name: 'Primary contact', type: 'singleLineText' as const, width: 180 },
    { id: 'fld2_email', name: 'Email', type: 'email' as const, width: 220 },
    { id: 'fld2_phone', name: 'Phone', type: 'phone' as const, width: 150 },
    { id: 'fld2_status', name: 'Stage', type: 'singleSelect' as const, width: 140, options: [
      { id: 'stg1', name: 'Lead', color: 'blueLight' },
      { id: 'stg2', name: 'Prospect', color: 'cyanLight' },
      { id: 'stg3', name: 'Qualified', color: 'yellowLight' },
      { id: 'stg4', name: 'Proposal', color: 'orangeLight' },
      { id: 'stg5', name: 'Closed Won', color: 'greenLight' },
      { id: 'stg6', name: 'Closed Lost', color: 'redLight' },
    ]},
    { id: 'fld2_deal', name: 'Deal size', type: 'currency' as const, width: 130 },
    { id: 'fld2_url', name: 'Website', type: 'url' as const, width: 200 },
    { id: 'fld2_close', name: 'Expected close', type: 'date' as const, width: 150 },
    { id: 'fld2_rating', name: 'Confidence', type: 'rating' as const, width: 130 },
  ];

  const table2Records = [
    { id: uuid(), cells: { fld2_name: 'Acme Corp', fld2_contact: 'Jane Smith', fld2_email: 'jane@acme.com', fld2_phone: '(555) 100-2000', fld2_status: 'Qualified', fld2_deal: 50000, fld2_url: 'https://acme.com', fld2_close: '2026-07-15', fld2_rating: 4 }, createdTime: '2026-06-01T10:00:00Z' },
    { id: uuid(), cells: { fld2_name: 'Globex Corporation', fld2_contact: 'Hank Scorpio', fld2_email: 'hank@globex.com', fld2_phone: '(555) 200-3000', fld2_status: 'Proposal', fld2_deal: 120000, fld2_url: 'https://globex.com', fld2_close: '2026-06-30', fld2_rating: 3 }, createdTime: '2026-06-02T10:00:00Z' },
    { id: uuid(), cells: { fld2_name: 'Initech', fld2_contact: 'Bill Lumbergh', fld2_email: 'bill@initech.com', fld2_phone: '(555) 300-4000', fld2_status: 'Lead', fld2_deal: 25000, fld2_url: 'https://initech.com', fld2_close: '2026-08-01', fld2_rating: 2 }, createdTime: '2026-06-03T10:00:00Z' },
    { id: uuid(), cells: { fld2_name: 'Umbrella Corp', fld2_contact: 'Alice Wesker', fld2_email: 'alice@umbrella.com', fld2_phone: '(555) 400-5000', fld2_status: 'Closed Won', fld2_deal: 85000, fld2_url: 'https://umbrella.com', fld2_close: '2026-05-20', fld2_rating: 5 }, createdTime: '2026-06-04T10:00:00Z' },
    { id: uuid(), cells: { fld2_name: 'Stark Industries', fld2_contact: 'Pepper Potts', fld2_email: 'pepper@stark.com', fld2_phone: '(555) 500-6000', fld2_status: 'Prospect', fld2_deal: 200000, fld2_url: 'https://stark.com', fld2_close: '2026-09-01', fld2_rating: 3 }, createdTime: '2026-06-05T10:00:00Z' },
    { id: uuid(), cells: { fld2_name: 'Wayne Enterprises', fld2_contact: 'Lucius Fox', fld2_email: 'lucius@wayne.com', fld2_phone: '(555) 600-7000', fld2_status: 'Qualified', fld2_deal: 150000, fld2_url: 'https://wayne.com', fld2_close: '2026-07-20', fld2_rating: 4 }, createdTime: '2026-06-06T10:00:00Z' },
  ];

  const table3Fields = [
    { id: 'fld3_title', name: 'Title', type: 'singleLineText' as const, width: 250, isPrimary: true },
    { id: 'fld3_author', name: 'Author', type: 'singleLineText' as const, width: 170 },
    { id: 'fld3_category', name: 'Category', type: 'singleSelect' as const, width: 140, options: [
      { id: 'cat1', name: 'Engineering', color: 'blueLight' },
      { id: 'cat2', name: 'Design', color: 'pinkLight' },
      { id: 'cat3', name: 'Product', color: 'purpleLight' },
      { id: 'cat4', name: 'Marketing', color: 'orangeLight' },
    ]},
    { id: 'fld3_status', name: 'Status', type: 'singleSelect' as const, width: 130, options: [
      { id: 'ds1', name: 'Draft', color: 'grayLight' },
      { id: 'ds2', name: 'Review', color: 'yellowLight' },
      { id: 'ds3', name: 'Published', color: 'greenLight' },
    ]},
    { id: 'fld3_date', name: 'Published', type: 'date' as const, width: 140 },
    { id: 'fld3_url', name: 'Link', type: 'url' as const, width: 240 },
  ];

  const table3Records = [
    { id: uuid(), cells: { fld3_title: 'Getting started with React 19', fld3_author: 'Cameron Toth', fld3_category: 'Engineering', fld3_status: 'Published', fld3_date: '2026-06-01', fld3_url: 'https://blog.example.com/react-19' }, createdTime: '2026-06-01T10:00:00Z' },
    { id: uuid(), cells: { fld3_title: 'Design system principles', fld3_author: 'Leslie Alexander', fld3_category: 'Design', fld3_status: 'Review', fld3_date: '', fld3_url: '' }, createdTime: '2026-06-02T10:00:00Z' },
    { id: uuid(), cells: { fld3_title: 'Q3 product roadmap update', fld3_author: 'Bailey Kuehn', fld3_category: 'Product', fld3_status: 'Draft', fld3_date: '', fld3_url: '' }, createdTime: '2026-06-03T10:00:00Z' },
    { id: uuid(), cells: { fld3_title: 'SEO best practices 2026', fld3_author: 'Jordan Walke', fld3_category: 'Marketing', fld3_status: 'Published', fld3_date: '2026-05-28', fld3_url: 'https://blog.example.com/seo-2026' }, createdTime: '2026-06-04T10:00:00Z' },
  ];

  const viewId1 = uuid();
  const viewId2 = uuid();
  const viewId3 = uuid();

  return {
    id: uuid(),
    name: 'Project Tracker',
    color: '#2D7FF9',
    icon: 'layout-grid',
    tables: [
      {
        id: 'tbl_tasks',
        name: 'Tasks',
        fields: table1Fields,
        records: table1Records,
        views: [
          { id: viewId1, name: 'Grid view', type: 'grid', filters: [], sorts: [], groups: [], hiddenFieldIds: [] },
          { id: uuid(), name: 'Kanban', type: 'kanban', filters: [], sorts: [], groups: [], hiddenFieldIds: [], kanbanFieldId: 'fld_status' },
          { id: uuid(), name: 'Calendar', type: 'calendar', filters: [], sorts: [], groups: [], hiddenFieldIds: [], calendarFieldId: 'fld_due' },
          { id: uuid(), name: 'Gallery', type: 'gallery', filters: [], sorts: [], groups: [], hiddenFieldIds: [] },
          { id: uuid(), name: 'Form', type: 'form', filters: [], sorts: [], groups: [], hiddenFieldIds: [] },
        ],
        activeViewId: viewId1,
      },
      {
        id: 'tbl_crm',
        name: 'CRM',
        fields: table2Fields,
        records: table2Records,
        views: [
          { id: viewId2, name: 'Grid view', type: 'grid', filters: [], sorts: [], groups: [], hiddenFieldIds: [] },
          { id: uuid(), name: 'Pipeline', type: 'kanban', filters: [], sorts: [], groups: [], hiddenFieldIds: [], kanbanFieldId: 'fld2_status' },
        ],
        activeViewId: viewId2,
      },
      {
        id: 'tbl_content',
        name: 'Content',
        fields: table3Fields,
        records: table3Records,
        views: [
          { id: viewId3, name: 'Grid view', type: 'grid', filters: [], sorts: [], groups: [], hiddenFieldIds: [] },
          { id: uuid(), name: 'Gallery', type: 'gallery', filters: [], sorts: [], groups: [], hiddenFieldIds: [] },
        ],
        activeViewId: viewId3,
      },
    ],
    activeTableId: 'tbl_tasks',
  };
}

export const sampleBase = createSampleBase();
