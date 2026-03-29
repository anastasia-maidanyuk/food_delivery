import { Box, Typography, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const RATING_RANGES = [
  { label: '⭐ 4.0 – 5.0', min: 4.0, max: 5.0 },
  { label: '⭐ 3.0 – 4.0', min: 3.0, max: 4.0 },
  { label: '⭐ 2.0 – 3.0', min: 2.0, max: 3.0 },
];

interface RatingFilterProps {
  selected: { min: number; max: number } | null;
  onChange: (range: { min: number; max: number } | null) => void;
}

export default function RatingFilter({ selected, onChange }: RatingFilterProps) {
  return (
    <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
        <StarIcon sx={{ color: '#ffc107', fontSize: 18 }} />
        <Typography variant="body2" fontWeight={700}>Filter by Rating</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {RATING_RANGES.map((range) => {
          const isActive = selected?.min === range.min && selected?.max === range.max;
          return (
            <Box
              key={range.label}
              onClick={() => onChange(isActive ? null : range)}
              sx={{
                px: 2, py: 1, borderRadius: 2, cursor: 'pointer',
                fontWeight: isActive ? 700 : 500, fontSize: 14,
                bgcolor: isActive ? '#d32f2f' : '#f5f5f5',
                color: isActive ? '#fff' : 'text.primary',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: isActive ? '#b71c1c' : '#ebebeb' },
              }}
            >
              {range.label}
            </Box>
          );
        })}
        {selected && (
          <Button
            size="small" color="error"
            onClick={() => onChange(null)}
            sx={{ textTransform: 'none', fontWeight: 600, alignSelf: 'flex-start', px: 0 }}
          >
            Clear filter
          </Button>
        )}
      </Box>
    </Box>
  );
}