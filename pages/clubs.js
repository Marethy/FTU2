import { useState } from 'react';
import { clubs as clubsData } from '../data/clubs';
import FilterBar from '../components/FilterBar';
import ClubList from '../components/ClubList';

const ClubsPage = () => {
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Get unique domains for FilterBar
  const uniqueDomains = [...new Set(clubsData.map(club => club.domain))];

  // Filter clubs based on selected domains and search keyword
  const filteredClubs = clubsData.filter(club => {
    const matchesDomain = selectedDomains.length === 0 || 
                         selectedDomains.includes(club.domain);
    const matchesSearch = !searchKeyword || 
                         club.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Clubs</h1>
      <FilterBar
        domains={uniqueDomains}
        onDomainChange={setSelectedDomains}
        onSearch={setSearchKeyword}
      />
      <ClubList data={filteredClubs} />
    </div>
  );
};

export default ClubsPage; 