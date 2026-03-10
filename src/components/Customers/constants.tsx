
import { Customer } from './types';
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Elena Gilbert',
    email: 'elena@example.com',
    phone: '+1 555 0123',
    history: [
      { id: 'h1', date: '2023-10-15', serviceId: 's1', staffId: 'st1', price: 1240 }
    ]
  },
  {
    id: 'c2',
    name: 'Damon Salvatore',
    email: 'damon@example.com',
    phone: '+1 555 0999',
    history: [
      { id: 'h2', date: '2023-09-20', serviceId: 's5', staffId: 'st2', price: 450 }
    ]
  },
  {
    id: 'c3',
    name: 'Stefan Salvatore',
    email: 'stefan@example.com',
    phone: '+1 555 1111',
    history: [
      { id: 'h3', date: '2023-11-02', serviceId: 's2', staffId: 'st1', price: 2100 }
    ]
  },
  {
    id: 'c4',
    name: 'Bonnie Bennett',
    email: 'bonnie@example.com',
    phone: '+1 555 2222',
    history: [
      { id: 'h4', date: '2023-08-14', serviceId: 's4', staffId: 'st3', price: 890 }
    ]
  },
];