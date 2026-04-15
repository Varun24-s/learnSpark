-- ============================================================
-- SEED DATA: Initial Learning Modules
-- 3 Numeracy tasks + 3 Shape tasks, each with tts_prompt
-- ============================================================

INSERT INTO modules (title, category, level, content) VALUES

-- ===================== NUMERACY =====================

(
  'Meet Number One',
  'Numeracy',
  1,
  '{
    "description": "Learn to recognise the number 1",
    "tts_prompt": "This is number one! One is special. You have one nose. Can you hold up one finger?",
    "visual": "number_1.svg",
    "visual_alt": "Number One - Like a single tall stick standing straight up",
    "exercise": {
      "type": "tap_count",
      "prompt": "Tap the screen ONE time!",
      "correct_answer": 1
    },
    "reward_phrase": "Amazing! You found number one! One gold star for you!"
  }'::jsonb
),

(
  'Discover Number Two',
  'Numeracy',
  1,
  '{
    "description": "Learn to recognise the number 2",
    "tts_prompt": "This is number two! Two looks like a swan on a lake. You have two eyes and two hands!",
    "visual": "number_2.svg",
    "visual_alt": "Number Two - Like a swan floating gracefully on water",
    "exercise": {
      "type": "tap_count",
      "prompt": "Tap the screen TWO times!",
      "correct_answer": 2
    },
    "reward_phrase": "Wonderful! You know number two! Two stars shining bright!"
  }'::jsonb
),

(
  'Explore Number Three',
  'Numeracy',
  1,
  '{
    "description": "Learn to recognise the number 3",
    "tts_prompt": "This is number three! Three has two bumps, like two little hills. A triangle has three sides!",
    "visual": "number_3.svg",
    "visual_alt": "Number Three - Like two little bumpy hills stacked on top of each other",
    "exercise": {
      "type": "tap_count",
      "prompt": "Tap the screen THREE times!",
      "correct_answer": 3
    },
    "reward_phrase": "Fantastic! Three is your friend! Three bright stars for you!"
  }'::jsonb
),

-- ===================== SHAPES =====================

(
  'The Friendly Circle',
  'Shapes',
  1,
  '{
    "description": "Learn about circles",
    "tts_prompt": "This is a circle! A circle is round and smooth, like a ball or the sun. It has no corners at all!",
    "visual": "shape_circle.svg",
    "visual_alt": "Circle - Like a ball or the round sun in the sky, perfectly smooth all around",
    "exercise": {
      "type": "find_shape",
      "prompt": "Can you find the circle? Tap the round shape!",
      "correct_shape": "circle"
    },
    "reward_phrase": "You found the circle! Round and round, well done!"
  }'::jsonb
),

(
  'The Strong Square',
  'Shapes',
  1,
  '{
    "description": "Learn about squares",
    "tts_prompt": "This is a square! A square has four sides that are all the same size. Its like a window or a picture frame!",
    "visual": "shape_square.svg",
    "visual_alt": "Blue Square - Like a window with four equal sides",
    "exercise": {
      "type": "find_shape",
      "prompt": "Can you find the square? Tap the shape with four equal sides!",
      "correct_shape": "square"
    },
    "reward_phrase": "You found the square! Strong and steady, great job!"
  }'::jsonb
),

(
  'The Pointy Triangle',
  'Shapes',
  1,
  '{
    "description": "Learn about triangles",
    "tts_prompt": "This is a triangle! A triangle has three sides and three pointy corners. Its like a slice of pizza or a mountain!",
    "visual": "shape_triangle.svg",
    "visual_alt": "Green Triangle - Like a slice of pizza or a tall mountain peak",
    "exercise": {
      "type": "find_shape",
      "prompt": "Can you find the triangle? Tap the shape with three pointy corners!",
      "correct_shape": "triangle"
    },
    "reward_phrase": "You found the triangle! Three sides, three cheers for you!"
  }'::jsonb
);
