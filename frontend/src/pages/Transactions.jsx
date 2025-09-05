// pages/Transactions.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Transactions = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Mock transactions data - replace with API call
    const mockTransactions = [
      {
        id: 'TX001',
        propertyId: 1,
        propertyTitle: 'Modern 3-Bedroom Apartment',
        amount: 1890000, // 1,800,000 + 5% service fee
        rentAmount: 1800000,
        serviceFee: 90000,
        type: userData.role === 'tenant' ? 'payment' : 'receipt',
        status: 'completed',
        date: '2023-11-15T10:30:00Z',
        counterparty: userData.role === 'tenant' ? 'Adebola Johnson' : 'Tunde Adeyemi',
        paymentMethod: 'bank_transfer',
        escrowStatus: 'released'
      },
      {
        id: 'TX002',
        propertyId: 2,
        propertyTitle: 'Cozy 2-Bedroom Flat',
        amount: 892500, // 850,000 + 5% service fee
        rentAmount: 850000,
        serviceFee: 42500,
        type: userData.role === 'tenant' ? 'payment' : 'receipt',
        status: 'pending',
        date: '2023-11-20T14:45:00Z',
        counterparty: userData.role === 'tenant' ? 'Chinedu Okoro' : 'Funke Adebayo',
        paymentMethod: 'card',
        escrowStatus: 'held'
      },
      {
        id: 'TX003',
        propertyId: 3,
        propertyTitle: 'Luxury Villa VI',
        amount: 3675000, // 3,500,000 + 5% service fee
        rentAmount: 3500000,
        serviceFee: 175000,
        type: userData.role === 'tenant' ? 'payment' : 'receipt',
        status: 'completed',
        date: '2023-11-05T09:15:00Z',
        counterparty: userData.role === 'tenant' ? 'Adebola Johnson' : 'Tunde Ojo',
        paymentMethod: 'wallet',
        escrowStatus: 'released'
      },
      {
        id: 'TX004',
        propertyId: 1,
        propertyTitle: 'Modern 3-Bedroom Apartment',
        amount: 1890000,
        rentAmount: 1800000,
        serviceFee: 90000,
        type: userData.role === 'tenant' ? 'payment' : 'receipt',
        status: 'cancelled',
        date: '2023-10-28T16:20:00Z',
        counterparty: userData.role === 'tenant' ? 'Adebola Johnson' : 'Chinedu Okoro',
        paymentMethod: 'bank_transfer',
        escrowStatus: 'refunded'
      }
    ];

    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getEscrowBadge = (status) => {
    const styles = {
      held: 'bg-blue-100 text-blue-800',
      released: 'bg-green-100 text-green-800',
      refunded: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      bank_transfer: '🏦',
      card: '💳',
      wallet: '📱'
    };
    return icons[method] || '💰';
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    cancelled: transactions.filter(t => t.status === 'cancelled').length,
    totalAmount: transactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/dashboard" className="text-green-600 hover:text-green-700 text-sm font-medium">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Transaction History</h1>
              <p className="text-gray-600">
                {user?.role === 'tenant' ? 'Your rental payments and transactions' : 'Your rental income and transactions'}
              </p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
              Download Statement
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">{stats.total}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">{stats.completed}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-lg font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-bold">{stats.pending}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-lg font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-bold">₦{formatNumber(stats.totalAmount)}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-lg font-semibold text-gray-900">₦{formatNumber(stats.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'completed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'pending' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'cancelled' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              {filter === 'all' ? 'All Transactions' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Transactions`}
              <span className="text-gray-500 ml-2">({filteredTransactions.length})</span>
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">{getPaymentMethodIcon(transaction.paymentMethod)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {transaction.propertyTitle}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {user?.role === 'tenant' ? 'Paid to ' : 'Received from '}
                          {transaction.counterparty}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 justify-end mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEscrowBadge(transaction.escrowStatus)}`}>
                          {transaction.escrowStatus}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ₦{formatNumber(transaction.amount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Rent: ₦{formatNumber(transaction.rentAmount)} + Fee: ₦{formatNumber(transaction.serviceFee)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Transaction ID: {transaction.id}
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/transactions/${transaction.id}`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Receipt
                      </button>
                      {transaction.status === 'pending' && (
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">💸</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No transactions found</h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? 'You don\'t have any transactions yet.'
                    : `You don't have any ${filter} transactions.`
                  }
                </p>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    View all transactions
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Need help with a transaction?</h3>
          <p className="text-blue-800 mb-4">
            Our support team is here to help you with any questions about your transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:support@naijarent.com"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium text-center"
            >
              Email Support
            </a>
            <a
              href="tel:+2348001234567"
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-center"
            >
              Call Support: +234 800 123 4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;