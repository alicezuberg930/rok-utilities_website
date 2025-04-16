// @mui
import { Typography, Stack, StackProps } from '@mui/material';
// components
import CustomImage from '../image';

// ----------------------------------------------------------------------

interface EmptyContentProps extends StackProps {
  title: string;
  img?: string;
  description?: string;
}

export default function EmptyContent({ title, description, img, sx, ...other }: EmptyContentProps) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 1,
        textAlign: 'center',
        p: (theme) => theme.spacing(8, 2),
        ...sx,
      }}
      {...other}
    >
      <CustomImage
        disabledEffect={true}
        alt="empty content"
        src={img || '/assets/illustrations/illustration_empty_content.svg'}
        sx={{ height: 240, mb: 3 }}
      />
      <Typography variant="h5" gutterBottom>{title}</Typography>
      {description && (
        <Typography variant="body2" color='error'>{description}</Typography>
      )}
    </Stack>
  );
}
