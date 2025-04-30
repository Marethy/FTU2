import { contests as contestsData } from '../data/contests';
import ContestList from '../components/ContestList';

const ContestsPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Contests</h1>
      <ContestList data={contestsData} />
    </div>
  );
};

export default ContestsPage; 