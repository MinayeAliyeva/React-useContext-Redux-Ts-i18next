import "./App.css";
import Products from "./components/products";
import HeaderComp from "./components/header";
import { black } from "./contextApi/ThemeContext";
import { useThemeContext } from "./contextApi/ThemeContext";

function App() {
  const { light, toggle, setToggle } = useThemeContext();
  return (
    <div className="App">
      <div style={toggle ? black : light}>Emin</div>
      <button onClick={() => setToggle?.((value) => !value)}>
        Change Color
      </button>
      <HeaderComp />
      <Products />
    </div>
  );
}

export default App;
