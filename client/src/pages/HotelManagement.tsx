import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, UserCheck, UserX } from 'lucide-react';
import './Hotel.css';

export default function HotelManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/hotel/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/hotel/bookings', formData);
      fetchBookings();
      setShowForm(false);
      setFormData({
        roomId: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        specialRequests: '',
      });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/hotel/bookings/${bookingId}/checkin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch (error) {
      alert('Failed to check in');
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/hotel/bookings/${bookingId}/checkout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch (error) {
      alert('Failed to check out');
    }
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Hotel Management System</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          New Booking
        </button>
      </div>

      {showForm && (
        <div className="card form-card">
          <h2>Create New Booking</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              type="text"
              placeholder="Guest Name"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Guest Email"
              value={formData.guestEmail}
              onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Guest Phone"
              value={formData.guestPhone}
              onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
              required
            />
            <input
              type="date"
              value={formData.checkInDate}
              onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
              required
            />
            <input
              type="date"
              value={formData.checkOutDate}
              onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Number of Guests"
              value={formData.numberOfGuests}
              onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
              required
            />
            <textarea
              placeholder="Special Requests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              style={{ gridColumn: '1 / -1' }}
            ></textarea>
            <button type="submit" className="btn btn-success">
              Create Booking
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="loading">Loading bookings...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Booking #</th>
                  <th>Guest</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td><strong>{booking.bookingNumber}</strong></td>
                      <td>{booking.guestName}</td>
                      <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${booking.status === 'checked-in' ? 'success' : booking.status === 'checked-out' ? 'info' : 'warning'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${booking.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td>${booking.totalPrice.toFixed(2)}</td>
                      <td>
                        {booking.status === 'confirmed' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleCheckIn(booking._id)}
                            title="Check In"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        {booking.status === 'checked-in' && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCheckOut(booking._id)}
                            title="Check Out"
                          >
                            <UserX size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
