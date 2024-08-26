import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useIntervalStore, useTimerStore } from "../path/to/your/stores"; // Ajusta el path según tu estructura
import SegundaPantalla from "../path/to/your/component/SegundaPantalla"; // Ajusta el path según tu estructura

describe("Segunda pantalla de la aplicación", () => {
  beforeEach(() => {
    useIntervalStore.setState({
      sessionNumber: 1,
      breakNumber: 0,
      remainingSessions: 4,
    });
    useTimerStore.setState({ countdown: "04:00:00", isSession: true });
  });

  describe("Estado actual de la aplicación", () => {
    it("debería mostrar un texto con el número de la sesión actual", () => {
      const { getByText } = render(<SegundaPantalla />);
      expect(getByText("Sesión actual: 1")).toBeTruthy();
    });

    it("debería mostrar un texto con el número de descanso actual", () => {
      const { getByText } = render(<SegundaPantalla />);
      expect(getByText("Descanso actual: 0")).toBeTruthy();
    });

    it("debería mostrar un texto con la cantidad de sesiones faltantes", () => {
      const { getByText } = render(<SegundaPantalla />);
      expect(getByText("Sesiones faltantes: 4")).toBeTruthy();
    });
  });

  describe("Componente Countdown", () => {
    it("debería renderizar el componente Countdown", () => {
      const { getByTestId } = render(<SegundaPantalla />);
      expect(getByTestId("countdown-component")).toBeTruthy();
    });

    it("debería contar hacia atrás de acuerdo con las horas totales divididas entre los intervalos", async () => {
      const { getByText } = render(<SegundaPantalla />);
      await waitFor(() => expect(getByText("03:59:59")).toBeTruthy());
    });

    it("debería cambiar su estado dependiendo si está en sesión o descanso", async () => {
      useTimerStore.setState({ isSession: false });
      const { getByText } = render(<SegundaPantalla />);
      expect(getByText("Descanso")).toBeTruthy();
    });
  });

  describe("Botón Pausar", () => {
    it('debería mostrar un botón con el nombre "pausar"', () => {
      const { getByText } = render(<SegundaPantalla />);
      expect(getByText("pausar")).toBeTruthy();
    });

    it('debería cambiar su nombre a "continuar" cuando se haga click', () => {
      const { getByText } = render(<SegundaPantalla />);
      fireEvent.press(getByText("pausar"));
      expect(getByText("continuar")).toBeTruthy();
    });

    it('debería pausar el countdown al hacer click en "pausar"', async () => {
      const { getByText } = render(<SegundaPantalla />);
      fireEvent.press(getByText("pausar"));
      await waitFor(() => expect(getByText("04:00:00")).toBeTruthy());
    });

    it("debería mostrar un modal las primeras 3 veces para recordar que no es una alternativa para descansar", () => {
      const { getByText, getByTestId } = render(<SegundaPantalla />);
      fireEvent.press(getByText("pausar"));
      expect(getByTestId("modal")).toBeTruthy();
      fireEvent.press(getByText("de acuerdo"));

      fireEvent.press(getByText("pausar"));
      expect(getByTestId("modal")).toBeTruthy();
      fireEvent.press(getByText("de acuerdo"));

      fireEvent.press(getByText("pausar"));
      expect(getByTestId("modal")).toBeTruthy();
      fireEvent.press(getByText("de acuerdo"));

      fireEvent.press(getByText("pausar"));
      expect(() => getByTestId("modal")).toThrow(
        "Unable to find an element with testID"
      );
    });

    it("debería aumentar una cuenta para saber cuántas veces se ha recordado al usuario", () => {
      const { getByText, getByTestId } = render(<SegundaPantalla />);
      fireEvent.press(getByText("pausar"));
      fireEvent.press(getByText("de acuerdo"));

      fireEvent.press(getByText("pausar"));
      fireEvent.press(getByText("de acuerdo"));

      fireEvent.press(getByText("pausar"));
      fireEvent.press(getByText("de acuerdo"));

      expect(useTimerStore.getState().reminderCount).toBe(3);
    });

    it('a la tercera vez de presionar "pausar", no debería mostrar más el modal', () => {
      const { getByText, getByTestId } = render(<SegundaPantalla />);
      fireEvent.press(getByText("pausar"));
      fireEvent.press(getByText("de acuerdo"));

      fireEvent.press(getByText("pausar"));
      fireEvent.press(getByText("de acuerdo"));

      fireEvent.press(getByText("pausar"));
      fireEvent.press(getByText("de acuerdo"));

      fireEvent.press(getByText("pausar"));
      expect(() => getByTestId("modal")).toThrow(
        "Unable to find an element with testID"
      );
    });

    it('debería continuar la cuenta regresiva desde donde quedó al presionar "continuar"', async () => {
      const { getByText } = render(<SegundaPantalla />);
      fireEvent.press(getByText("pausar"));
      fireEvent.press(getByText("continuar"));
      await waitFor(() => expect(getByText("03:59:59")).toBeTruthy());
    });
  });

  describe("Botón Detener", () => {
    it('debería mostrar un botón llamado "detener"', () => {
      const { getByText } = render(<SegundaPantalla />);
      expect(getByText("detener")).toBeTruthy();
    });

    it('debería mostrar un modal con un diálogo de confirmación al presionar "detener"', () => {
      const { getByText, getByTestId } = render(<SegundaPantalla />);
      fireEvent.press(getByText("detener"));
      expect(getByTestId("confirmation-dialog")).toBeTruthy();
    });

    it("debería mostrar otro modal con un diálogo de disculpas y ánimo al confirmar la detención", () => {
      const { getByText, getByTestId } = render(<SegundaPantalla />);
      fireEvent.press(getByText("detener"));
      fireEvent.press(getByText("confirmar"));
      expect(getByTestId("apology-dialog")).toBeTruthy();
    });
  });

  describe("Diálogos entre sesión y descanso", () => {
    it('debería mostrar un diálogo con "descanso en 10s" o "sesión en 10s"', async () => {
      useTimerStore.setState({ isSession: true });
      const { getByText } = render(<SegundaPantalla />);
      await waitFor(() => expect(getByText("descanso en 10s")).toBeTruthy());

      useTimerStore.setState({ isSession: false });
      await waitFor(() => expect(getByText("sesión en 10s")).toBeTruthy());
    });

    it("en la última sesión, no debería mostrar otro descanso y debería saltar al siguiente estado de la aplicación", () => {
      useIntervalStore.setState({ sessionNumber: 5 });
      const { queryByText } = render(<SegundaPantalla />);
      expect(queryByText("descanso en 10s")).toBeNull();
      expect(queryByText("sesión en 10s")).toBeNull();
      // Aquí se podría comprobar que se ha cambiado al siguiente estado de la app
    });
  });
});
