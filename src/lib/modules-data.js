/**
 * Static module data — used as fallback when Supabase
 * is unreachable or not yet configured.
 * Mirrors supabase/seed.sql exactly.
 */

export const MODULES = [
    {
        id: "num-1",
        title: "Meet Number One",
        category: "Numeracy",
        level: 1,
        content: {
            description: "Learn to recognise the number 1",
            tts_prompt:
                "This is number one! One is special. You have one nose. Can you hold up one finger?",
            visual_alt:
                "Number One - Like a single tall stick standing straight up",
            exercise: {
                type: "tap_count",
                prompt: "Tap the screen ONE time!",
                correct_answer: 1,
            },
            reward_phrase:
                "Amazing! You found number one! One gold star for you!",
            svg: '<path d="M50 15 L50 85 M40 25 L50 15" stroke-linecap="round" stroke-linejoin="round" />',
            color: "#fbbf24",
        },
    },
    {
        id: "num-2",
        title: "Discover Number Two",
        category: "Numeracy",
        level: 1,
        content: {
            description: "Learn to recognise the number 2",
            tts_prompt:
                "This is number two! Two looks like a swan on a lake. You have two eyes and two hands!",
            visual_alt:
                "Number Two - Like a swan floating gracefully on water",
            exercise: {
                type: "tap_count",
                prompt: "Tap the screen TWO times!",
                correct_answer: 2,
            },
            reward_phrase:
                "Wonderful! You know number two! Two stars shining bright!",
            svg: '<path d="M30 35 C30 15, 70 15, 70 35 C70 55, 30 65, 30 85 L70 85" stroke-linecap="round" stroke-linejoin="round" />',
            color: "#f472b6",
        },
    },
    {
        id: "num-3",
        title: "Explore Number Three",
        category: "Numeracy",
        level: 1,
        content: {
            description: "Learn about number 3",
            tts_prompt:
                "This is number three! Three has two bumps, like two little hills. A triangle has three sides!",
            visual_alt:
                "Number Three - Like two little bumpy hills stacked on top of each other",
            exercise: {
                type: "tap_count",
                prompt: "Tap the screen THREE times!",
                correct_answer: 3,
            },
            reward_phrase:
                "Fantastic! Three is your friend! Three bright stars for you!",
            svg: '<path d="M30 20 C60 20, 70 35, 50 45 C70 55, 60 80, 30 80" stroke-linecap="round" stroke-linejoin="round" />',
            color: "#34d399",
        },
    },
    {
        id: "shape-circle",
        title: "The Friendly Circle",
        category: "Shapes",
        level: 1,
        content: {
            description: "Learn about circles",
            tts_prompt:
                "This is a circle! A circle is round and smooth, like a ball or the sun. It has no corners at all!",
            visual_alt:
                "Circle - Like a ball or the round sun in the sky, perfectly smooth all around",
            exercise: {
                type: "find_shape",
                prompt: "Can you find the circle? Tap the round shape!",
                correct_shape: "circle",
            },
            reward_phrase: "You found the circle! Round and round, well done!",
            emoji: "🔴",
            color: "#f472b6",
            svg: '<circle cx="50" cy="50" r="40" />',
        },
    },
    {
        id: "shape-square",
        title: "The Strong Square",
        category: "Shapes",
        level: 1,
        content: {
            description: "Learn about squares",
            tts_prompt:
                "This is a square! A square has four sides that are all the same size. It's like a window or a picture frame!",
            visual_alt:
                "Blue Square - Like a window with four equal sides",
            exercise: {
                type: "find_shape",
                prompt:
                    "Can you find the square? Tap the shape with four equal sides!",
                correct_shape: "square",
            },
            reward_phrase:
                "You found the square! Strong and steady, great job!",
            emoji: "🟦",
            color: "#22d3ee",
            svg: '<rect x="15" y="15" width="70" height="70" rx="6" />',
        },
    },
    {
        id: "shape-triangle",
        title: "The Pointy Triangle",
        category: "Shapes",
        level: 1,
        content: {
            description: "Learn about triangles",
            tts_prompt:
                "This is a triangle! A triangle has three sides and three pointy corners. It's like a slice of pizza or a mountain!",
            visual_alt:
                "Green Triangle - Like a slice of pizza or a tall mountain peak",
            exercise: {
                type: "find_shape",
                prompt:
                    "Can you find the triangle? Tap the shape with three pointy corners!",
                correct_shape: "triangle",
            },
            reward_phrase:
                "You found the triangle! Three sides, three cheers for you!",
            emoji: "🔺",
            color: "#34d399",
            svg: '<polygon points="50,10 90,85 10,85" />',
        },
    },
];

export function getModulesByCategory(category) {
    return MODULES.filter((m) => m.category === category);
}

export function getModuleById(id) {
    return MODULES.find((m) => m.id === id) || null;
}
