// Individual Workshop Detail Page with Booking Flow

'use client';

import  { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
//import { getWorkshopById } from '@/data/workshops';
// import { WorkshopCard } from '@/components/workshops/WorkshopCard';
import { formatPrice, formatDate } from '@/lib/utils';
import { workshops as staticWorkshops} from '@/data/workshops';
import { fetchWorkshopsClient } from '@/lib/api';
import type { Workshop } from '@/types/workshop';
import { registerWorkshop } from '@/lib/api';


 export default function WorkshopDetailPage() {
  // 1️⃣ params
  const params = useParams();
  const workshopId = params.id as string;

  // 2️⃣ state (THIS CREATES setWorkshop)
  const [workshop, setWorkshop] = useState<Workshop | null>(null);

  // 3️⃣ effect
  useEffect(() => {
    fetchWorkshopsClient().then((data) => {
      if (Array.isArray(data)) {
        const found = data.find((w: Workshop) => String(w.id) === workshopId);
        if (found) {
          setWorkshop(found);
          return;
        }
      }
      setWorkshop(null);
    });
  }, [workshopId]);
  
  // Booking flow state
  const [bookingStep, setBookingStep] = useState<'details' | 'calendar' | 'form'|'experience' | 'review'>('details');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    participants: 1,
    experienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    specialRequests: '',
  });

  if (!workshop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#2C2C2C] mb-4">Workshop Not Found</h1>
          <Link href="/workshops" className="text-[#8B6F47] hover:underline">
            Return to Workshops
          </Link>
        </div>
      </div>
    );
  }

  // Get available dates for selected month
  const getAvailableDatesForMonth = () => {
    return workshop.schedule.filter(s => {
      const scheduleDate = new Date(s.date);
      return (
        scheduleDate.getMonth() === currentMonth.getMonth() &&
        scheduleDate.getFullYear() === currentMonth.getFullYear() &&
        s.isAvailable
      );
    });
  };

  // Get time slots for selected date
  const getTimeSlotsForDate = () => {
    if (!selectedDate) return [];
    return workshop.schedule.filter(s => s.date === selectedDate && s.isAvailable);
  };

  // Calendar navigation
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isAvailable: false,
        date: null,
      });
    }
    const stepOrder = ['calendar', 'form', 'experience', 'review'] as const;

    // Current month days
    const availableDates = getAvailableDatesForMonth();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isAvailable = availableDates.some(s => s.date === dateString);
      
      days.push({
        day,
        isCurrentMonth: true,
        isAvailable,
        date: dateString,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isAvailable: false,
        date: null,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const timeSlots = getTimeSlotsForDate();
  const selectedSchedule = workshop.schedule.find(s => s.date === selectedDate && s.startTime === selectedTime);

  // Calculate total
  const subtotal = workshop.pricePerPerson ? workshop.price * formData.participants : workshop.price;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  // Related workshops
  const relatedWorkshops = staticWorkshops
  .filter(w => w.type === workshop.type && w.id !== workshop.id)
  .slice(0, 3);


  const handleContinueToCalendar = () => {
    setBookingStep('calendar');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinueToForm = () => {
    if (!selectedDate || !selectedTime) return;
    setBookingStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleContinueToExperience = () => {
    setBookingStep('experience');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueToReview = () => {
    setBookingStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const handleBack = () => {
  if (bookingStep === 'review') setBookingStep('experience');
  else if (bookingStep === 'experience') setBookingStep('form');
  else if (bookingStep === 'form') setBookingStep('calendar');
  else if (bookingStep === 'calendar') setBookingStep('details');
};


const handleConfirmBooking = async () => {
  if (!selectedSchedule || isSubmitting) return;

  setIsSubmitting(true);

  try {
    const payload = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      workshop: Number(workshop.id),
      slot: Number(selectedSchedule.id),
      number_of_participants: formData.participants,
      special_requests: formData.specialRequests || '',
    };

    const response = await registerWorkshop(payload);

    console.log('Booking success:', response);
    setBookingSuccess(true);
  } catch (err: any) {
    console.error(err);
    alert(
      err?.error ||
      'Booking failed. Slot may be full or unavailable.'
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-[#666]">
          <Link href="/" className="hover:text-[#8B6F47]">Home</Link>
          <span>/</span>
          <Link href="/workshops" className="hover:text-[#8B6F47]">Workshops</Link>
          <span>/</span>
          <span className="text-[#2C2C2C]">{workshop.name}</span>
        </nav>
      </div>

      {bookingStep !== 'details' && (
  <div className="bg-white border-b border-[#E5E5E5]">
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-center gap-8">

        {/* Step 1 */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
            ['calendar','form','experience','review'].includes(bookingStep)
              ? 'bg-[#8B6F47]' : 'bg-[#D4C5B0]'
          }`}>
            1
          </div>
          <span className="text-sm font-medium text-[#2C2C2C]">
            Slot Booking
          </span>
          <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
            ['form','experience','review'].includes(bookingStep)
              ? 'bg-[#8B6F47]' : 'bg-[#D4C5B0]'
          }`}>
            2
          </div>
          <span className={`text-sm font-medium ${
            ['form','experience','review'].includes(bookingStep)
              ? 'text-[#2C2C2C]' : 'text-[#666]'
          }`}>
            Your Details
          </span>
          <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
            ['experience','review'].includes(bookingStep)
              ? 'bg-[#8B6F47]' : 'bg-[#D4C5B0]'
          }`}>
            3
          </div>
          <span className={`text-sm font-medium ${
            ['experience','review'].includes(bookingStep)
              ? 'text-[#2C2C2C]' : 'text-[#666]'
          }`}>
            Experience Level
          </span>
          <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Step 4 */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
            bookingStep === 'review'
              ? 'bg-[#8B6F47]' : 'bg-[#D4C5B0]'
          }`}>
            4
          </div>
          <span className={`text-sm font-medium ${
            bookingStep === 'review'
              ? 'text-[#2C2C2C]' : 'text-[#666]'
          }`}>
            Review & Pay
          </span>
        </div>

      </div>
    </div>
  </div>
)}

      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-16">
        {/* Workshop Details View */}
        {bookingStep === 'details' && (
          <>
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {/* Left: Image */}
              <div className="relative aspect-[4/3] bg-[#F6EFE1] rounded-sm overflow-hidden">
                <Image
                  src={workshop.images[0]}
                  alt={workshop.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Right: Info */}
              <div>
                {/* Badges */}
                <div className="flex gap-3 mb-4">
                  <span className="bg-[#F6EFE1] px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-[#666] rounded-full">
                    {workshop.type}
                  </span>
                  <span className="bg-[#4A7C59] px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-white rounded-full">
                    {workshop.level}
                  </span>
                </div>

                {/* Name */}
                <h1 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-6">
                  {workshop.name}
                </h1>

                {/* Description */}
                <p className="text-[#666] leading-relaxed mb-8">
                  {workshop.longDescription}
                </p>

                {/* Quick Info */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-[#f6efe1] rounded-sm">
                    <svg className="w-8 h-8 mx-auto mb-2 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-[#2C2C2C]">{workshop.duration}</p>
                  </div>

                  <div className="text-center p-4 bg-[#f6EFE1] rounded-sm">
                    <svg className="w-8 h-8 mx-auto mb-2 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm font-medium text-[#2C2C2C]">
                      {workshop.participants.min}-{workshop.participants.max} participants
                    </p>
                  </div>

                  <div className="text-center p-4 bg-[#F6EFE1] rounded-sm">
                    <svg className="w-8 h-8 mx-auto mb-2 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm font-medium text-[#2C2C2C]">Basho Studio</p>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-[#F6EFE1] p-6 rounded-sm mb-8">
                  <p className="text-3xl font-semibold text-[#8B6F47] mb-1">
                    {formatPrice(workshop.price)}
                  </p>
                  <p className="text-sm text-[#666]">{workshop.pricePerPerson ? 'per person' : 'total'}</p>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-serif text-[#2C2C2C] mb-8">What's Included</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {workshop.includes.map((item, index) => (
                  <div key={index} className="bg-[#F6EFE1] p-6 rounded-sm">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-[#4A7C59] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-[#2C2C2C]">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={handleContinueToCalendar}
                className="bg-[#8B6F47] text-white px-12 py-4 rounded-sm font-medium hover:bg-[#6D5836] transition-colors text-lg"
              >
                Select Date & Time
              </button>
            </div>
          </>
        )}

        {/* Calendar View */}
        {bookingStep === 'calendar' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <svg className="w-8 h-8 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-3xl font-serif text-[#2C2C2C]">Select Date & Time</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Calendar */}
              <div className="bg-white p-8 rounded-sm shadow-sm">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-[#F6EFE1] rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-xl font-medium text-[#2C2C2C]">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-[#F6EFE1] rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-[#666] py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day.isAvailable && day.date && handleDateSelect(day.date)}
                      disabled={!day.isAvailable || !day.date}
                      className={`aspect-square flex items-center justify-center rounded-sm text-sm transition-colors ${
                        !day.isCurrentMonth
                          ? 'text-[#CCC] cursor-default'
                          : day.isAvailable
                          ? selectedDate === day.date
                            ? 'bg-[#8B6F47] text-white font-medium'
                            : 'bg-[#E8DFD0] text-[#2C2C2C] hover:bg-[#D4C5B0] cursor-pointer'
                          : 'bg-[#F5F5F5] text-[#999] cursor-not-allowed'
                      }`}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#E8DFD0] rounded"></div>
                    <span className="text-sm text-[#666]">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#F5F5F5] rounded"></div>
                    <span className="text-sm text-[#666]">Unavailable</span>
                  </div>
                </div>
              </div>

              {/* Time Slots & Summary */}
              <div>
                {selectedDate ? (
                  <>
                    {/* Available Times */}
                    <div className="bg-white p-8 rounded-sm shadow-sm mb-6">
                      <h3 className="text-lg font-medium text-[#2C2C2C] mb-4">
                        Available Times for {formatDate(selectedDate).split(',')[0]}
                      </h3>
                      
                      {timeSlots.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {timeSlots.map((slot, index) => (
                              <button
                                key={index}
                                onClick={() => handleTimeSelect(slot.startTime)}
                                className={`p-4 rounded-sm border-2 transition-all ${
                                  selectedTime === slot.startTime
                                    ? 'border-[#8B6F47] bg-[#8B6F47] text-white'
                                    : 'border-[#D4C5B0] hover:border-[#8B6F47] hover:bg-[#FAF8F5]'
                                }`}
                              >
                                <p className="font-medium">{slot.startTime}</p>
                              </button>
                            ))}
                          </div>
                          <p className="text-sm text-[#666]">
                            {selectedSchedule?.availableSpots || 0} spots remaining
                          </p>
                        </>
                      ) : (
                        <p className="text-[#666]">No available times for this date.</p>
                      )}
                    </div>

                    {/* Booking Summary */}
                    {selectedDate && selectedTime && (
                      <div className="bg-white p-8 rounded-sm shadow-sm">
                        <h3 className="text-lg font-medium text-[#2C2C2C] mb-4">Booking Summary</h3>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between">
                            <span className="text-[#666]">Workshop</span>
                            <span className="text-[#2C2C2C] font-medium">{workshop.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#666]">Date</span>
                            <span className="text-[#2C2C2C]">{new Date(selectedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#666]">Time</span>
                            <span className="text-[#2C2C2C]">{selectedTime}</span>
                          </div>
                        </div>

                        <div className="border-t border-[#E5E5E5] pt-4 mb-6">
                          <div className="flex justify-between items-baseline">
                            <span className="text-lg font-medium text-[#2C2C2C]">Total</span>
                            <span className="text-2xl font-semibold text-[#8B6F47]">
                              {formatPrice(workshop.price)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={handleContinueToForm}
                          disabled={!selectedDate || !selectedTime}
                          className="w-full bg-[#8B6F47] text-white py-4 rounded-sm font-medium hover:bg-[#6D5836] transition-colors uppercase tracking-wide"
                        >
                          Continue to Book
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white p-12 rounded-sm shadow-sm text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-[#D4C5B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[#666]">Select a date from the calendar to see available time slots</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form View - Step 1 */}

        {bookingStep === 'form' && (
          <div className="max-w-2xl mx-auto">
            {/* Workshop Summary Card */}
            <div className="bg-white p-6 rounded-sm shadow-sm mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={workshop.images[0]}
                  alt={workshop.name}
                  width={80}
                  height={80}
                  className="rounded-sm object-cover"
                />
                <div>
                  <h3 className="font-medium text-[#2C2C2C] mb-1">{workshop.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-[#666]">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {selectedDate && new Date(selectedDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-[#8B6F47]">{formatPrice(workshop.price)}</p>
                <p className="text-sm text-[#666]">per person</p>
              </div>
            </div>

            {/* Form - Your Details */}
            <div className="bg-white p-8 rounded-sm shadow-sm mb-6">
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-8">Your Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm uppercase tracking-widest text-[#666] mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    required
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 text-[#666] border-[#E5E5E5] rounded-sm focus:border-[#8B6F47] focus:outline-none transition-colors placeholder:text-[#333]"

                  />
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-widest text-[#666] mb-2">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 text-[#666] border-[#E5E5E5] rounded-sm focus:border-[#8B6F47] focus:outline-none transition-colors placeholder:text-[#333]"

                  />
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-widest text-[#666] mb-2">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 xxxxxxxxxx"
                    className="w-full px-4 py-3 border-2 text-[#666] border-[#E5E5E5] rounded-sm focus:border-[#8B6F47] focus:outline-none transition-colors placeholder:text-[#333]"

                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="flex-1 border-2 border-[#8B6F47] text-[#8B6F47] py-4 rounded-sm font-medium hover:bg-[#FAF8F5] transition-colors uppercase tracking-wide"
              >
                Back
              </button>
              <button
                onClick={handleContinueToExperience}
                disabled={!formData.fullName || !formData.email || !formData.phone}
                className="flex-1 bg-[#8B6F47] text-white py-4 rounded-sm font-medium hover:bg-[#6D5836] transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}
       {bookingStep === 'experience' && (
  <div className="max-w-2xl mx-auto">
    {/* Workshop Summary Card */}
    <div className="bg-white p-6 rounded-sm shadow-sm mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={workshop.images[0]}
          alt={workshop.name}
          width={80}
          height={80}
          className="rounded-sm object-cover"
        />
        <div>
          <h3 className="font-medium text-[#2C2C2C] mb-1">
            {workshop.name}
          </h3>
          <div className="flex items-center gap-4 text-sm text-[#666]">
            <span className="flex items-center gap-1">
              📅 {selectedDate && new Date(selectedDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              ⏰ {selectedTime}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-semibold text-[#8B6F47]">
          {formatPrice(workshop.price)}
        </p>
        <p className="text-sm text-[#666]">per person</p>
      </div>
    </div>

    {/* Experience & Group Size */}
    <div className="bg-white p-8 rounded-sm shadow-sm mb-6">
      <h2 className="text-2xl font-serif text-[#2C2C2C] mb-8">
        Experience & Group Size
      </h2>

      {/* Participants */}
      <div className="mb-6 ">
        <label className="block text-sm uppercase tracking-widest text-[#666] mb-2">
          Number of Participants
        </label>
        <select
          value={formData.participants}
          onChange={(e) =>
            setFormData({
              ...formData,
              participants: Number(e.target.value),
            })
          }
          className="w-full px-4 text-[#666] py-3 border-2 border-[#E5E5E5] rounded-sm focus:border-[#8B6F47] focus:outline-none"
        >
          {Array.from(
  { length: workshop.participants.max - workshop.participants.min + 1 },
  (_, i) => workshop.participants.min + i).map((num) => (
            <option key={num} value={num}>
              {num} person{num > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Level */}
      <div className="mb-6">
        <label className="block text-sm uppercase tracking-widest text-[#666] mb-3">
          Your Experience Level
        </label>

        <div className="grid grid-cols-3 gap-4">
          {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
            <button
              key={level}
              type="button"
              onClick={() =>
                setFormData({ ...formData, experienceLevel: level })
              }
              className={`py-4 rounded-sm border-2 font-medium transition-all ${
                formData.experienceLevel === level
                  ? 'border-[#8B6F47] bg-[#FAF8F5] text-[#8B6F47]'
                  : 'border-[#E5E5E5] text-[#666] hover:border-[#8B6F47]'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Special Requests */}
            <div>
            <label className="block text-sm uppercase tracking-widest text-[#666] mb-2">
            Special Requests (Optional)
            </label>
            <textarea
            value={formData.specialRequests}
            onChange={(e) =>
            setFormData({ ...formData, specialRequests: e.target.value })
          }
          rows={4}
          placeholder="Any dietary requirements, accessibility needs, or special requests..."
          className="w-full px-4 py-3 text-[#666] border-2 border-[#E5E5E5] rounded-sm focus:border-[#8B6F47] focus:outline-none resize-none placeholder:text-[#333]"

           />
          </div>
          </div>

          {/* Navigation */}
        <div className="flex gap-4">
            <button
            onClick={handleBack}
            className="flex-1 border-2 border-[#8B6F47] text-[#8B6F47] py-4 rounded-sm font-medium hover:bg-[#FAF8F5] transition-colors uppercase"
          >
            Back
          </button>
          <button
            onClick={handleContinueToReview}
            className="flex-1 bg-[#8B6F47] text-white py-4 rounded-sm font-medium hover:bg-[#6D5836] transition-colors uppercase"
          >
           Confirm Booking {formatPrice(total)}
          </button>
            </div>
      </div>
      )}
        {/* Review & Confirm */}
        {bookingStep === 'review' && (
          <div className="max-w-2xl mx-auto">
            {/* Workshop Summary */}
            <div className="bg-white p-6 rounded-sm shadow-sm mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={workshop.images[0]}
                  alt={workshop.name}
                  width={80}
                  height={80}
                  className="rounded-sm object-cover"
                />
                <div>
                  <h3 className="font-medium text-[#2C2C2C] mb-1">{workshop.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-[#666]">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {selectedDate && new Date(selectedDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-[#645239]">{formatPrice(workshop.price)}</p>
                <p className="text-sm text-[#666]">per person</p>
              </div>
            </div>

            {/* Review & Confirm */}
            <div className="bg-white p-8 rounded-sm shadow-sm mb-6">
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-8">Review & Confirm</h2>
              
              {/* Booking Details */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[#2C2C2C] mb-4 pb-3 border-b border-[#E5E5E5]">
                  Booking Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#666]">Workshop</span>
                    <span className="text-[#2C2C2C] font-medium text-right">{workshop.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Date</span>
                    <span className="text-[#2C2C2C]">{selectedDate && new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Time</span>
                    <span className="text-[#2C2C2C]">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Participants</span>
                    <span className="text-[#2C2C2C]">{formData.participants}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[#2C2C2C] mb-4 pb-3 border-b border-[#E5E5E5]">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#666]">Name</span>
                    <span className="text-[#2C2C2C]">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Email</span>
                    <span className="text-[#2C2C2C]">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Phone</span>
                    <span className="text-[#2C2C2C]">{formData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-[#F6EFE1] p-6 rounded-sm">
                <h3 className="text-lg font-medium text-[#2C2C2C] mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#666]">{workshop.name} × {formData.participants}</span>
                    <span className="text-[#2C2C2C]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">GST (18%)</span>
                    <span className="text-[#2C2C2C]">{formatPrice(gst)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#D4C5B0]">
                    <span className="text-lg font-medium text-[#2C2C2C]">Total</span>
                    <span className="text-2xl font-semibold text-[#8B6F47]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-5 h-5 text-[#8B6F47] border-[#D4C5B0] rounded" required />
                <span className="text-sm text-[#666]">
                  I agree to the <Link href="#" className="text-[#8B6F47] underline">Terms & Conditions</Link> and{' '}
                  <Link href="#" className="text-[#8B6F47] underline">Cancellation Policy</Link>. I understand that a confirmation
                  email will be sent to {formData.email}.
                </span>
              </label>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="flex-1 border-2 border-[#8B6F47] text-[#8B6F47] py-4 rounded-sm font-medium hover:bg-[#FAF8F5] transition-colors uppercase tracking-wide"
              >
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="flex-1 bg-[#C9B896] text-[#2C2C2C] py-4 rounded-sm font-medium
                          hover:bg-[#B8A785] transition-colors uppercase tracking-wide
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Booking...' : `Confirm Booking ${formatPrice(total)}`}
              </button>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}










