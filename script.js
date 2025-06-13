
        // Application State
        const appState = {
            currentView: 'gold',
            goldHoldings: 50.00,
            silverHoldings: 200.00,
            goldPrice: 76.50,
            silverPrice: 0.85,
            transactionHistory: [
                { id: 1, type: 'Purchase', amount: '10g Gold', date: '2024-12-15', status: 'Completed' },
                { id: 2, type: 'Spend', amount: '5g Silver', date: '2024-12-14', status: 'Completed' },
                { id: 3, type: 'Purchase', amount: '25g Gold', date: '2024-12-13', status: 'Completed' }
            ]
        };

        // DOM Elements
        const goldViewBtn = document.getElementById('goldViewBtn');
        const silverViewBtn = document.getElementById('silverViewBtn');
        const goldCard = document.getElementById('goldCard');
        const silverCard = document.getElementById('silverCard');
        const goldAmount = document.getElementById('goldAmount');
        const silverAmount = document.getElementById('silverAmount');
        const goldValue = document.getElementById('goldValue');
        const silverValue = document.getElementById('silverValue');
        const totalValue = document.getElementById('totalValue');
        const currentMetal = document.getElementById('currentMetal');
        const availableAmount = document.getElementById('availableAmount');
        const spendAmount = document.getElementById('spendAmount');
        const spendValue = document.getElementById('spendValue');
        const spendUsdValue = document.getElementById('spendUsdValue');
        const spendButton = document.getElementById('spendButton');

        // Initialize the application
        function init() {
            updateDisplay();
            updateSpendForm();
        }

        // Toggle between gold and silver views
        function toggleView(metal) {
            appState.currentView = metal;
            
            // Update button styles
            if (metal === 'gold') {
                goldViewBtn.className = 'px-6 py-3 rounded-lg font-semibold transition-all bg-gold text-black shadow-lg';
                silverViewBtn.className = 'px-6 py-3 rounded-lg font-semibold transition-all bg-gray-200 text-gray-700 hover:bg-gray-300';
                goldCard.className = 'bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-lg border-2 border-gold gold-shine';
                silverCard.className = 'bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg border-2 border-transparent silver-glow';
            } else {
                goldViewBtn.className = 'px-6 py-3 rounded-lg font-semibold transition-all bg-gray-200 text-gray-700 hover:bg-gray-300';
                silverViewBtn.className = 'px-6 py-3 rounded-lg font-semibold transition-all bg-silver text-black shadow-lg';
                goldCard.className = 'bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-lg border-2 border-transparent gold-shine';
                silverCard.className = 'bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg border-2 border-silver silver-glow';
            }
            
            updateSpendForm();
        }

        // Update spend form based on current view
        function updateSpendForm() {
            const metal = appState.currentView;
            const metalName = metal.charAt(0).toUpperCase() + metal.slice(1);
            const available = metal === 'gold' ? appState.goldHoldings : appState.silverHoldings;
            
            currentMetal.textContent = metalName;
            availableAmount.textContent = `${available.toFixed(2)}g`;
            spendAmount.placeholder = `Enter amount in grams (Available: ${available.toFixed(2)}g)`;
            
            if (metal === 'gold') {
                spendButton.className = 'w-full py-4 rounded-lg font-semibold text-lg transition-all bg-gold hover:bg-yellow-600 text-black btn-animate';
                spendButton.textContent = 'Spend Gold';
            } else {
                spendButton.className = 'w-full py-4 rounded-lg font-semibold text-lg transition-all bg-silver hover:bg-gray-500 text-black btn-animate';
                spendButton.textContent = 'Spend Silver';
            }
            
            // Clear spend amount when switching
            spendAmount.value = '';
            spendValue.classList.add('hidden');
        }

        // Update spend value display
        function updateSpendValue() {
            const amount = parseFloat(spendAmount.value);
            if (amount && amount > 0) {
                const price = appState.currentView === 'gold' ? appState.goldPrice : appState.silverPrice;
                const usdValue = (amount * price).toFixed(2);
                spendUsdValue.textContent = `$${usdValue}`;
                spendValue.classList.remove('hidden');
            } else {
                spendValue.classList.add('hidden');
            }
        }

        // Handle spend transaction
        function handleSpend(event) {
            event.preventDefault();
            
            const amount = parseFloat(spendAmount.value);
            if (!amount || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            const currentHoldings = appState.currentView === 'gold' ? appState.goldHoldings : appState.silverHoldings;
            if (amount > currentHoldings) {
                alert('Insufficient ' + appState.currentView + ' holdings');
                return;
            }

            // Update holdings
            if (appState.currentView === 'gold') {
                appState.goldHoldings -= amount;
            } else {
                appState.silverHoldings -= amount;
            }

            // Add to transaction history
            const newTransaction = {
                id: appState.transactionHistory.length + 1,
                type: 'Spend',
                amount: `${amount.toFixed(2)}g ${appState.currentView.charAt(0).toUpperCase() + appState.currentView.slice(1)}`,
                date: new Date().toISOString().split('T')[0],
                status: 'Completed'
            };

            appState.transactionHistory.unshift(newTransaction);

            // Update display
            updateDisplay();
            updateSpendForm();
            updateTransactionHistory();

            alert('Transaction successful!');
            spendAmount.value = '';
            spendValue.classList.add('hidden');
        }

        // Handle newsletter signup
        function handleNewsletterSignup(event) {
            event.preventDefault();
            const email = document.getElementById('newsletterEmail').value;
            console.log('Newsletter signup:', email);
            alert('Thank you for subscribing!');
            document.getElementById('newsletterEmail').value = '';
        }

        // Update display values
        function updateDisplay() {
            const goldVal = appState.goldHoldings * appState.goldPrice;
            const silverVal = appState.silverHoldings * appState.silverPrice;
            const total = goldVal + silverVal;

            goldAmount.textContent = `${appState.goldHoldings.toFixed(2)}g`;
            silverAmount.textContent = `${appState.silverHoldings.toFixed(2)}g`;
            goldValue.textContent = `$${goldVal.toFixed(2)}`;
            silverValue.textContent = `$${silverVal.toFixed(2)}`;
            totalValue.textContent = `$${total.toFixed(2)}`;
        }

        // Update transaction history display
        function updateTransactionHistory() {
            const tbody = document.getElementById('transactionHistory');
            tbody.innerHTML = '';

            appState.transactionHistory.forEach((transaction) => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50';
                
                const typeClass = transaction.type === 'Purchase' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
                
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-3 py-1 rounded-full text-sm font-semibold ${typeClass}">${transaction.type}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">${transaction.amount}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-gray-600">${transaction.date}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">${transaction.status}</span>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
        }

        // Toggle FAQ
        function toggleFaq(index) {
            const answer = document.getElementById(`faq-answer-${index}`);
            const icon = document.getElementById(`faq-icon-${index}`);
            
            if (answer.classList.contains('open')) {
                answer.classList.remove('open');
                icon.style.transform = 'rotate(0deg)';
            } else {
                // Close all other FAQs
                for (let i = 0; i < 4; i++) {
                    const otherAnswer = document.getElementById(`faq-answer-${i}`);
                    const otherIcon = document.getElementById(`faq-icon-${i}`);
                    if (otherAnswer && otherAnswer.classList.contains('open')) {
                        otherAnswer.classList.remove('open');
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
                
                answer.classList.add('open');
                icon.style.transform = 'rotate(180deg)';
            }
        }

        // Toggle mobile menu (placeholder)
        function toggleMobileMenu() {
            alert('Mobile menu functionality can be implemented based on your needs');
        }

        // Initialize the application when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);

        // Add some real-time price simulation (optional)
        setInterval(() => {
            // Small random price fluctuations for demo purposes
            const goldChange = (Math.random() - 0.5) * 0.1;
            const silverChange = (Math.random() - 0.5) * 0.001;
            
            appState.goldPrice = Math.max(0, appState.goldPrice + goldChange);
            appState.silverPrice = Math.max(0, appState.silverPrice + silverChange);
            
            updateDisplay();
        }, 30000); // Update every 30 seconds
    