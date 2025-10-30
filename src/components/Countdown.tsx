import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  const isPast = +new Date(targetDate) < +new Date();

  if (isPast) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Event has passed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-lg p-4">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-rose-600" />
        <span className="text-sm font-medium text-gray-700">Countdown to Your Day</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="text-2xl font-bold text-rose-600">{timeLeft.days}</div>
            <div className="text-xs text-gray-600">Days</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="text-2xl font-bold text-rose-600">{timeLeft.hours}</div>
            <div className="text-xs text-gray-600">Hours</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="text-2xl font-bold text-rose-600">{timeLeft.minutes}</div>
            <div className="text-xs text-gray-600">Mins</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="text-2xl font-bold text-rose-600">{timeLeft.seconds}</div>
            <div className="text-xs text-gray-600">Secs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
