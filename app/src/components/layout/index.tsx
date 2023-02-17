import Container from '@mui/material/Container';
import AppBar from './AppBar';
import Footer from './Footer';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <AppBar />
      <Container maxWidth="xl">
        <main style={{ minHeight: `calc(100vh - 70px - 32px)`, paddingTop: '48px' }}>{children}</main>
      </Container>
      <Footer></Footer>
    </>
  );
}
