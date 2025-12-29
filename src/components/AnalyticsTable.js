import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

const Th = styled.th`
  padding: 12px;
  background: #f4f6f8;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #e5e7eb;
`;

const Growth = styled.span`
  color: ${({ value }) => (value >= 0 ? "green" : "red")};
  font-weight: 600;
`;

export default function EventAnalyticsTable({ events }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Event</Th>
          <Th>Last Year</Th>
          <Th>Current</Th>
          <Th>Growth</Th>
        </tr>
      </thead>
      <tbody>
        {events.map((e) => {
          const growth =
            ((e.current_attendance - e.last_year_attendance) /
              e.last_year_attendance) *
            100;

          return (
            <tr key={e.subevent_id}>
              <Td>{e.title}</Td>
              <Td>{e.last_year_attendance}</Td>
              <Td>{e.current_attendance}</Td>
              <Td>
                <Growth value={growth}>
                  {growth.toFixed(1)}%
                </Growth>
              </Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
