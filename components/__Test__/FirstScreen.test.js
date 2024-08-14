import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { renderRouter, screen } from "expo-router/testing-library";
import App from "../../app/index";
import SetTimer from "../SetTimer";
import SetRest from "../SetRest";
import IntervalHamburger from "../IntervalHamburger";
import IntervalModal from "../../app/(modal)/intervalModal";
import TimeStatus from "../TimeStatus";

describe("PrimerScreen", () => {
  it("debería mostrar un componente con 3 TextInput, un input seguido de la letra h, un input seguido de la letra m y un input seguido de la letra s", () => {
    const { getByTestId } = render(<SetTimer />);

    const hourInput1 = getByTestId("hour-input-1");
    const minuteInput1 = getByTestId("minute-input-1");
    const secondInput1 = getByTestId("second-input-1");
    const hourLabel1 = getByTestId("hour-label-1");
    const minuteLabel1 = getByTestId("minute-label-1");
    const secondLabel1 = getByTestId("second-label-1");

    expect(hourInput1).toBeTruthy();
    expect(minuteInput1).toBeTruthy();
    expect(secondInput1).toBeTruthy();
    expect(hourLabel1.props.children).toBe("h");
    expect(minuteLabel1.props.children).toBe("m");
    expect(secondLabel1.props.children).toBe("s");
  });

  it("debería mostrar el componente SetRest con 3 TextInput, un input seguido de la letra h, un input seguido de la letra m y un input seguido de la letra s", () => {
    const { getByTestId } = render(<SetRest />);

    const hourInput2 = getByTestId("hour-input-2");
    const minuteInput2 = getByTestId("minute-input-2");
    const secondInput2 = getByTestId("second-input-2");
    const hourLabel2 = getByTestId("hour-label-2");
    const minuteLabel2 = getByTestId("minute-label-2");
    const secondLabel2 = getByTestId("second-label-2");

    expect(hourInput2).toBeTruthy();
    expect(minuteInput2).toBeTruthy();
    expect(secondInput2).toBeTruthy();
    expect(hourLabel2.props.children).toBe("h");
    expect(minuteLabel2.props.children).toBe("m");
    expect(secondLabel2.props.children).toBe("s");
  });

  it("debería permitir editar las horas totales al oprimir sobre el input de SetTimer", () => {
    const { getByTestId } = render(<SetTimer />);
    const hourInput = getByTestId("hour-input-1");
    fireEvent.press(hourInput);
    fireEvent.changeText(hourInput, "10");
    expect(hourInput.props.value).toBe("10");
  });

  it("debería permitir agregar minutos al dar oprimir sobre minutos en el componente SetTimer", () => {
    const { getByTestId } = render(<SetTimer />);
    const minuteInput = getByTestId("minute-input-1");
    fireEvent.press(minuteInput);
    fireEvent.changeText(minuteInput, "45");
    expect(minuteInput.props.value).toBe("45");
  });

  it("no debería permitir editar los segundos", () => {
    const { getByTestId } = render(<SetTimer />);
    const secondInput = getByTestId("second-input-1");
    expect(secondInput.props.editable).toBe(false);
  });

  it("no debería permitir números mayores a 59 en los minutos", () => {
    const { getByTestId } = render(<SetTimer />);
    const minuteInput = getByTestId("minute-input-1");
    fireEvent.changeText(minuteInput, "60");
    expect(minuteInput.props.value).toBe("59");
    fireEvent.changeText(minuteInput, "99");
    expect(minuteInput.props.value).toBe("59");
  });

  it("debería formatear el input de minutos en el componente SetRest para llegar hasta 30m", () => {
    const { getByTestId } = render(<SetRest />);
    const minuteInput2 = getByTestId("minute-input-2");
    fireEvent.changeText(minuteInput2, "60");
    expect(minuteInput2.props.value).toBe("30");
    fireEvent.changeText(minuteInput2, "99");
    expect(minuteInput2.props.value).toBe("30");
  });

  it("no debería permitir más de 3 caracteres por input en SetTimer", () => {
    const { getByTestId } = render(<SetTimer />);
    const hourInput1 = getByTestId("hour-input-1");
    const minuteInput1 = getByTestId("minute-input-1");

    fireEvent.changeText(hourInput1, "1234");
    fireEvent.changeText(minuteInput1, "1234");

    expect(hourInput1.props.value.length).toBeLessThanOrEqual(2);
    expect(minuteInput1.props.value.length).toBeLessThanOrEqual(2);
  });

  it("no debería permitir más de 3 caracteres por input en SetRest", () => {
    const { getByTestId } = render(<SetRest />);
    const minuteInput2 = getByTestId("minute-input-2");

    fireEvent.changeText(minuteInput2, "1234");

    expect(minuteInput2.props.value.length).toBeLessThanOrEqual(2);
  });

  it("debería mostrar un btn hamburger", () => {
    const { getByTestId } = render(<IntervalHamburger />);
    const hamburgerBtn = getByTestId("hamburger-btn");
    expect(hamburgerBtn).toBeTruthy();
  });

  it("el btn hamburger debería mostrar un modal para modificar el número de intervalos", async () => {
    const MockIntervalModal = jest.fn(() => <IntervalHamburger />);

    renderRouter(
      {
        index: MockIntervalModal,
        "(modal)/IntervalModal": MockIntervalModal,
      },
      {
        initialUrl: "/(modal)/IntervalModal",
      }
    );

    expect(screen).toHavePathname("/IntervalModal");
  });

  it("deberia tener un input para agregar el numero de intervalos", () => {
    const { getByTestId } = render(<IntervalModal />);
    const intervalInput = getByTestId("interval-input");
    expect(intervalInput).toBeTruthy();
  });

  it("el número de intervalos por defecto debería ser 5 o 6", () => {
    const { getByTestId } = render(<IntervalModal />);
    const intervalInput = getByTestId("interval-input");
    expect(intervalInput.props.value).toMatch("5");
  });

  it("debería mostrar un componente con las horas efectivas", () => {
    const { getByTestId } = render(<TimeStatus />);
    const timeStatusRender = getByTestId("time-status-component");

    expect(timeStatusRender).toBeTruthy();
  });

  it("debería calcular el tiempo total correctamente", () => {
    const { getByTestId } = render(<PrimerScreen />);
    const hourInput = getByTestId("hour-input");
    const minuteInput = getByTestId("minute-input");
    const intervalInput = getByTestId("interval-input");
    fireEvent.changeText(hourInput, "2");
    fireEvent.changeText(minuteInput, "10");
    fireEvent.changeText(intervalInput, "5");
    const totalTime = getByTestId("total-time");
    expect(totalTime.props.children).toBe("2:50");
  });

  it("debería navegar a la pantalla de countDown al presionar el botón iniciar", () => {
    const { getByText, getByTestId } = render(<PrimerScreen />);
    const iniciarBtn = getByTestId("iniciar-btn");
    fireEvent.press(iniciarBtn);
    // Aquí puedes agregar la lógica para verificar la navegación
    expect(getByText("CountDown")).toBeTruthy();
  });
});
