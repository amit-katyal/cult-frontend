// Global scope for dummyCoinData
const dummyCoinData = {
    trending: [
        { name: "DogeSnoop", image: "https://via.placeholder.com/150", marketCap: "$1.2M", volume: "$500K", verified: true },
        { name: "ElonMeow", image: "https://via.placeholder.com/150", marketCap: "$800K", volume: "$300K", verified: false },
        { name: "ShibYe", image: "https://via.placeholder.com/150", marketCap: "$2.5M", volume: "$800K", verified: true },
        { name: "ApeSwift", image: "https://via.placeholder.com/150", marketCap: "$500K", volume: "$100K", verified: false },
        { name: "CardiFloki", image: "https://via.placeholder.com/150", marketCap: "$1.8M", volume: "$650K", verified: true },
        { name: "DrakeMoon", image: "https://via.placeholder.com/150", marketCap: "$950K", volume: "$400K", verified: false },
        { name: "KimKoin", image: "https://via.placeholder.com/150", marketCap: "$3.2M", volume: "$1.1M", verified: true },
        { name: "BTSBonk", image: "https://via.placeholder.com/150", marketCap: "$700K", volume: "$200K", verified: false },
        { name: "BieberCash", image: "https://via.placeholder.com/150", marketCap: "$1.5M", volume: "$550K", verified: true },
        { name: "GagaGold", image: "https://via.placeholder.com/150", marketCap: "$850K", volume: "$350K", verified: false },
        { name: "LeoLunar", image: "https://via.placeholder.com/150", marketCap: "$2.8M", volume: "$900K", verified: true },
        { name: "OprahOrbit", image: "https://via.placeholder.com/150", marketCap: "$600K", volume: "$150K", verified: false },
    ],
    explore: [
        { name: "ExploreCoin1", image: "https://via.placeholder.com/150", marketCap: "$1.1M", volume: "$450K", verified: true },
        { name: "ExploreCoin2", image: "https://via.placeholder.com/150", marketCap: "$750K", volume: "$250K", verified: false },
        { name: "DogeSnoop", image: "https://via.placeholder.com/150", marketCap: "$1.2M", volume: "$500K", verified: true },
        { name: "ElonMeow", image: "https://via.placeholder.com/150", marketCap: "$800K", volume: "$300K", verified: false },
        { name: "ShibYe", image: "https://via.placeholder.com/150", marketCap: "$2.5M", volume: "$800K", verified: true },
        { name: "ApeSwift", image: "https://via.placeholder.com/150", marketCap: "$500K", volume: "$100K", verified: false },
        { name: "CardiFloki", image: "https://via.placeholder.com/150", marketCap: "$1.8M", volume: "$650K", verified: true },
        { name: "DrakeMoon", image: "https://via.placeholder.com/150", marketCap: "$950K", volume: "$400K", verified: false },
        { name: "ExploreCoin3", image: "https://via.placeholder.com/150", marketCap: "$2.3M", volume: "$750K", verified: true },
        { name: "ExploreCoin4", image: "https://via.placeholder.com/150", marketCap: "$450K", volume: "$80K", verified: false },
    ],
    hot: [
        { name: "HotCoin1", image: "https://via.placeholder.com/150", marketCap: "$1.5M", volume: "$600K", verified: true },
        { name: "DogeSnoop", image: "https://via.placeholder.com/150", marketCap: "$1.2M", volume: "$500K", verified: true },
        { name: "ElonMeow", image: "https://via.placeholder.com/150", marketCap: "$800K", volume: "$300K", verified: false },
        { name: "ShibYe", image: "https://via.placeholder.com/150", marketCap: "$2.5M", volume: "$800K", verified: true },
        { name: "HotCoin2", image: "https://via.placeholder.com/150", marketCap: "$900K", volume: "$350K", verified: false },
        { name: "ApeSwift", image: "https://via.placeholder.com/150", marketCap: "$500K", volume: "$100K", verified: false },
        { name: "CardiFloki", image: "https://via.placeholder.com/150", marketCap: "$1.8M", volume: "$650K", verified: true },
        { name: "DrakeMoon", image: "https://via.placeholder.com/150", marketCap: "$950K", volume: "$400K", verified: false },
        { name: "HotCoin3", image: "https://via.placeholder.com/150", marketCap: "$2.7M", volume: "$850K", verified: true },
        { name: "HotCoin4", image: "https://via.placeholder.com/150", marketCap: "$550K", volume: "$120K", verified: false },
    ],
    'newly-launched': [
        { name: "NewCoin1", image: "https://via.placeholder.com/150", marketCap: "$500K", volume: "$100K", verified: false },
        { name: "DogeSnoop", image: "https://via.placeholder.com/150", marketCap: "$1.2M", volume: "$500K", verified: true },
        { name: "ElonMeow", image: "https://via.placeholder.com/150", marketCap: "$800K", volume: "$300K", verified: false },
        { name: "ShibYe", image: "https://via.placeholder.com/150", marketCap: "$2.5M", volume: "$800K", verified: true },
        { name: "NewCoin2", image: "https://via.placeholder.com/150", marketCap: "$800K", volume: "$300K", verified: true },
        { name: "NewCoin3", image: "https://via.placeholder.com/150", marketCap: "$1.2M", volume: "$450K", verified: false },
        { name: "NewCoin4", image: "https://via.placeholder.com/150", marketCap: "$600K", volume: "$150K", verified: true },
        { name: "ApeSwift", image: "https://via.placeholder.com/150", marketCap: "$500K", volume: "$100K", verified: false },
        { name: "CardiFloki", image: "https://via.placeholder.com/150", marketCap: "$1.8M", volume: "$650K", verified: true },
        { name: "DrakeMoon", image: "https://via.placeholder.com/150", marketCap: "$950K", volume: "$400K", verified: false },
    ],
};

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const coinSections = document.querySelectorAll('.coin-section');
    const filterButtons = document.querySelectorAll('.filter-button');
    const filterOptions = document.querySelectorAll('.filter-options');
    const coinGrids = document.querySelectorAll('.coin-grid');

    // Function to generate coin cards, handles null coinGrid
    function generateCoinCards(sectionId, data) {
        const coinGrid = document.querySelector(`#${sectionId} .coin-grid`);
        if (!coinGrid) {
            console.error(`Coin grid not found for section: ${sectionId}`);
            return; // Exit if coinGrid is null
        }
        coinGrid.innerHTML = ''; // Clear previous cards
        data.forEach(coin => {
            const card = document.createElement('div');
            card.classList.add('coin-card');
            card.innerHTML = `
                <img src="${coin.image}" alt="${coin.name}">
                <h3>${coin.name}</h3>
                <p>Market Cap: ${coin.marketCap}</p>
                <p>Volume: ${coin.volume}</p>
                <p>Verified: ${coin.verified ? 'Yes' : 'No'}</p>
            `;
            coinGrid.appendChild(card);
        });
    }

    // Function to show a specific tab and load its data
    function showTab(tabId) {
        navLinks.forEach(link => link.classList.remove('active'));
        coinSections.forEach(section => section.classList.remove('active'));

        const activeLink = document.querySelector(`nav a[data-tab="${tabId}"]`);
        const activeSection = document.getElementById(tabId);

        // Check if elements exist before manipulating them
        if (activeLink && activeSection) {
            activeLink.classList.add('active');
            activeSection.classList.add('active');
            fetchCoinData(tabId);
        } else {
            console.error(`Tab elements not found for tabId: ${tabId}`);
        }
    }

    // Tab Switching
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            showTab(link.dataset.tab);
        });
    });

    // Filter Button and Options - Handles null filterOptions
    filterButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            button.classList.toggle('active');

            const options = filterOptions[index];
            if (!options) { // Check for null
                console.error(`Filter options not found for index: ${index}`);
                return;
            }

             if (options.style.opacity === '0' || options.style.opacity === '') {
                options.style.display = 'block';
                requestAnimationFrame(() => {
                    options.style.opacity = '1';
                    options.style.transform = 'translateY(0)';
                });
            } else {
                options.style.opacity = '0';
                options.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    options.style.display = 'none';
                }, 300);
            }

            // Close other filter options
            filterButtons.forEach((otherButton, otherIndex) => {
                if (otherIndex !== index) {
                    otherButton.classList.remove('active');
                    // Also handle null for other filter options
                    if (filterOptions[otherIndex]) {
                      filterOptions[otherIndex].style.display = 'none';
                      filterOptions[otherIndex].style.opacity = '0';
                      filterOptions[otherIndex].style.transform = 'translateY(-10px)';
                    }

                }
            });

            applyFilter(index);
        });
    });

    // Close filter options when clicking outside
   document.addEventListener('click', (event) => {
      filterButtons.forEach((button, index) => {
        // Check if filterOptions[index] exists before accessing its properties
        if (filterOptions[index] && !button.contains(event.target) && !filterOptions[index].contains(event.target)) {
            button.classList.remove('active');
            filterOptions[index].style.display = 'none';
            filterOptions[index].style.opacity = '0';
            filterOptions[index].style.transform = 'translateY(-10px)';
        }
    });
});

    // Function to apply the filter - Handles null and missing elements
    function applyFilter(index) {
      const options = filterOptions[index];
      if (!options) {
          console.error(`Filter options not found for index: ${index}`);
          return;
      }

      const selectedMarketCap = options.querySelector('[name="marketcap"]')?.value;
      const selectedVolume = options.querySelector('[name="volume"]')?.value;
      const isVerifiedOnly = options.querySelector('[name="verified"]')?.checked;

      const currentTabSection = coinGrids[index]?.closest('.coin-section');
      if (!currentTabSection) {
          console.error(`Current tab section not found for index: ${index}`);
          return;
      }

      const currentTabId = currentTabSection.id;
      if (!dummyCoinData[currentTabId]) {
          console.error(`No data found for tab: ${currentTabId}`);
          return;
      }

      let data = dummyCoinData[currentTabId];

      // Apply filters, handling potential errors
      try {
          if (isVerifiedOnly) {
              data = data.filter(coin => coin.verified);
          }

          if (selectedMarketCap) {
              data = data.filter(coin => {
                  const marketCapNum = parseFloat(coin.marketCap.replace(/[\$,M]/g, ''));
                  if (selectedMarketCap === 'low') return marketCapNum < 1;
                  if (selectedMarketCap === 'mid') return marketCapNum >= 1 && marketCapNum < 5;
                  if (selectedMarketCap === 'high') return marketCapNum >= 5;
                  return true; // No filtering
              });
          }

          if (selectedVolume) {
              data = data.filter(coin => {
                  const volumeNum = parseFloat(coin.volume.replace(/[\$,K]/g, ''));
                  if (selectedVolume === 'low') return volumeNum < 250;
                  if (selectedVolume === 'mid') return volumeNum >= 250 && volumeNum < 750;
                  if (selectedVolume === 'high') return volumeNum >= 750;
                  return true; // No filtering
              });
          }
        } catch (error){
             console.error("Error during filtering", error)
        }

        generateCoinCards(currentTabId, data);
    }

    // Add event listeners to filter options - Handles null
    filterOptions.forEach((options, index) => {
        if (!options) {
            console.error(`Filter options not found for index: ${index}`);
            return;
        }
        options.querySelector('[name="marketcap"]')?.addEventListener('change', () => applyFilter(index));
        options.querySelector('[name="volume"]')?.addEventListener('change', () => applyFilter(index));
        options.querySelector('[name="verified"]')?.addEventListener('change', () => applyFilter(index));
    });


    // Fetch coin data (in a real app, this would be an API call)
    function fetchCoinData(tabId) {
        // Check if the tabId exists in dummyCoinData
        if (dummyCoinData[tabId]) {
            generateCoinCards(tabId, dummyCoinData[tabId]);
        } else {
            console.error(`No data found for tabId: ${tabId}`);
        }
    }

    // Initial data load (for the "Trending" tab)
    showTab('trending');
});