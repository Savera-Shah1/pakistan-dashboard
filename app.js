// Pakistan Macroeconomic Dashboard JavaScript

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeCharts();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            
            console.log('Switching to tab:', targetTab); // Debug log
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show the target content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
                console.log('Activated tab content:', targetTab); // Debug log
                
                // Special handling for charts
                if (targetTab === 'monetary') {
                    setTimeout(() => {
                        const chart = Chart.getChart('yieldCurveChart');
                        if (chart) {
                            chart.resize();
                        }
                    }, 100);
                }
            } else {
                console.error('Tab content not found:', targetTab); // Debug log
            }
            
            // Scroll to top
            smoothScrollToTop();
        });
    });
    
    // Initialize first tab
    const firstTab = document.getElementById('title');
    if (firstTab) {
        firstTab.style.display = 'block';
    }
}

function initializeCharts() {
    // Wait a bit before creating charts to ensure DOM is ready
    setTimeout(() => {
        createYieldCurveChart();
    }, 500);
}

function createYieldCurveChart() {
    const ctx = document.getElementById('yieldCurveChart');
    if (!ctx) {
        console.log('Yield curve chart canvas not found');
        return;
    }

    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    // Pakistan Government Bond Yield Curve Data (representative data based on current conditions)
    const yieldCurveData = {
        labels: ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '10Y', '15Y', '20Y', '30Y'],
        datasets: [{
            label: 'Pakistan Government Bond Yields (%)',
            data: [10.2, 10.8, 11.1, 11.3, 11.6, 11.9, 12.2, 12.06, 12.4, 12.7, 13.1],
            borderColor: '#32B8C5', // Teal color from design system
            backgroundColor: 'rgba(50, 184, 197, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#32B8C5',
            pointBorderColor: '#1F2121',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };

    const config = {
        type: 'line',
        data: yieldCurveData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Pakistan Government Bond Yield Curve (Current)',
                    color: '#32B8C5',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#F5F5F5',
                        font: {
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(38, 40, 40, 0.9)',
                    titleColor: '#32B8C5',
                    bodyColor: '#F5F5F5',
                    borderColor: '#32B8C5',
                    borderWidth: 1,
                    cornerRadius: 6,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Yield: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Maturity',
                        color: '#F5F5F5',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: '#A7A9A9',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(167, 169, 169, 0.2)',
                        drawBorder: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Yield (%)',
                        color: '#F5F5F5',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: '#A7A9A9',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(167, 169, 169, 0.2)',
                        drawBorder: false
                    },
                    min: 9,
                    max: 14
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#32B8C5',
                    hoverBorderColor: '#1F2121'
                }
            }
        }
    };

    try {
        new Chart(ctx, config);
        console.log('Yield curve chart created successfully');
    } catch (error) {
        console.error('Error creating yield curve chart:', error);
    }
}

// Additional utility functions for dashboard interactivity
function formatNumber(num, decimals = 1) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(decimals) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toFixed(decimals);
}

function formatCurrency(amount, currency = '$') {
    if (typeof amount === 'number') {
        return currency + formatNumber(amount);
    }
    return amount;
}

function formatPercentage(value, decimals = 1) {
    return value.toFixed(decimals) + '%';
}

// Add smooth scrolling for better UX
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add keyboard navigation for tabs
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const activeTab = document.querySelector('.tab-btn.active');
        const currentIndex = Array.from(tabButtons).indexOf(activeTab);
        
        if (e.key === 'ArrowRight' && currentIndex < tabButtons.length - 1) {
            e.preventDefault();
            tabButtons[currentIndex + 1].click();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            tabButtons[currentIndex - 1].click();
        }
    }
});

// Add loading animation for images
function handleImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
            // Create fallback placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'chart-placeholder';
            placeholder.innerHTML = '<p>Chart data loading...</p>';
            placeholder.style.cssText = `
                background: var(--color-charcoal-800);
                border: 1px solid rgba(167, 169, 169, 0.2);
                border-radius: 12px;
                padding: 60px 20px;
                text-align: center;
                color: var(--color-gray-300);
                margin: 24px 0;
            `;
            this.parentNode.insertBefore(placeholder, this);
        });
        
        // Initial styling for smooth loading
        img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        img.style.opacity = '0.7';
        img.style.transform = 'scale(0.98)';
    });
}

// Initialize image loading handlers
document.addEventListener('DOMContentLoaded', handleImageLoading);

// Add print functionality
function printDashboard() {
    window.print();
}

// Add export functionality (basic)
function exportData(format = 'json') {
    const economicData = {
        country: 'Pakistan',
        lastUpdated: new Date().toISOString(),
        indicators: {
            policyRate: 11.0,
            inflation: 4.1,
            fxReserves: 14.5,
            gdpGrowth: 2.5,
            fiscalDeficit: -6.8,
            debtToGDP: 80.0,
            currentAccount: 1.5,
            exchangeRate: 278
        }
    };
    
    if (format === 'json') {
        const dataStr = JSON.stringify(economicData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'pakistan_economic_data.json';
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Add keyboard shortcuts info
function showKeyboardShortcuts() {
    alert(`Keyboard Shortcuts:
    
Ctrl/Cmd + → : Next tab
Ctrl/Cmd + ← : Previous tab
Ctrl/Cmd + P : Print dashboard
    
Use tab navigation or click tabs to explore different sections.`);
}

// Performance optimization - lazy load heavy content
function observeTabChanges() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger any lazy loading here
                const tabId = entry.target.id;
                console.log(`Tab ${tabId} is now visible`);
            }
        });
    });
    
    document.querySelectorAll('.tab-content').forEach(tab => {
        observer.observe(tab);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', observeTabChanges);

// Add resize handler for responsive charts
window.addEventListener('resize', function() {
    // Chart.js handles resize automatically, but we can add custom logic here
    const charts = Chart.getChart('yieldCurveChart');
    if (charts) {
        charts.resize();
    }
});

// Error handling for charts
if (typeof Chart !== 'undefined') {
    Chart.defaults.plugins.tooltip.enabled = true;
    Chart.defaults.plugins.legend.display = true;
}

// Add accessibility improvements
function improveAccessibility() {
    // Add ARIA labels to interactive elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((button, index) => {
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', button.classList.contains('active'));
        button.setAttribute('tabindex', button.classList.contains('active') ? '0' : '-1');
    });
    
    // Add ARIA labels to tab panels
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((content, index) => {
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('aria-hidden', !content.classList.contains('active'));
    });
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', improveAccessibility);

// Update accessibility on tab change
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tab-btn')) {
        setTimeout(improveAccessibility, 100);
    }
});

// Debug function to list all tabs and their content
function debugTabs() {
    console.log('=== DEBUG: Tab Information ===');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Tab Buttons:', tabButtons.length);
    tabButtons.forEach((btn, i) => {
        console.log(`${i}: ${btn.textContent} -> data-tab="${btn.getAttribute('data-tab')}"`);
    });
    
    console.log('Tab Contents:', tabContents.length);
    tabContents.forEach((content, i) => {
        console.log(`${i}: id="${content.id}" class="${content.className}"`);
    });
    
    console.log('=== END DEBUG ===');
}

// Call debug function on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(debugTabs, 1000);
});

console.log('Pakistan Macroeconomic Dashboard loaded successfully');