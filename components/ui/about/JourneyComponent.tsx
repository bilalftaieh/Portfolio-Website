import { Journey } from '@/lib/definitions';
import { useState } from 'react';
import ScrollTrigger from 'react-scroll-trigger';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import { Image } from '@nextui-org/react';

export default function JourneyComponent({ journey }: { journey: Journey }) {
    const [isVisible, setIsVisible] = useState(false);

    const onEnterViewport = () => {
        setIsVisible(true);
    }

    const onExitViewport = () => {
        setIsVisible(false);
    }

    const hideImageClass = journey.journey_image.length == 0 ? 'hidden md:block`' : '';
    const startDate = format(new Date(journey.journey_start_date), 'MMM yyyy');
    const endDate = journey.journey_end_date.length !== 0 ? format(new Date(journey.journey_end_date), 'MMM yyyy')
        : 'present';
    const sanitizedJourneyDescription = DOMPurify.sanitize(journey.journey_description)

    return (
        // @ts-ignore
        <ScrollTrigger onEnter={onEnterViewport} onExit={onExitViewport}>
            <div className={`md:grid md:grid-cols-4 gap-10 flex flex-col items-center md:items-start
            transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                <div className='md:col-span-3'>
                    <h2 className="text-2xl font-bold mb-2 text-center">{journey.journey_name} ({startDate} - {endDate})</h2>
                    <div dangerouslySetInnerHTML={{ __html: sanitizedJourneyDescription }} />
                </div>

                <div className={`md:col-span-1 ${hideImageClass} p-4`}>
                    <Image src={journey.journey_image} alt='journey-image' width={200} height={200} />
                </div>
            </div>
        </ScrollTrigger>
    )
}
