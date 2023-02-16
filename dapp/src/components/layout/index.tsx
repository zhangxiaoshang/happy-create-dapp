import AppBar from "./AppBar";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <AppBar />
      <main>{children}</main>
    </>
  );
}
