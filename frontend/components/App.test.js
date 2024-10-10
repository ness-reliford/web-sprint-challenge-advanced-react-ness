import React from "react"
import AppFunctional from "./AppFunctional"
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'


// Write your tests here
describe('AppFunctional', () => {
  
  let user, input, submit, message, left, right, up, down, reset, coordinates, steps

  test('[1] input changes correctly', async () => {
    render(<AppFunctional />)
    user = userEvent.setup()
    input = screen.getByPlaceholderText('type email')
    await user.type(input, 'lady@gaga.com')
    expect(input).toHaveValue('lady@gaga.com')
  })
  
  test('[2] visible texts in headings, buttons, links... render on the screen', async () => {
    render(<AppFunctional />)
    coordinates = await screen.findByText(/coordinates/i); 
    steps = await screen.getByRole('heading', { level: 3, name: "You moved 0 times" });
    message = await screen.getByRole('heading', { level: 3, name: "" });
    left = await screen.getByText(/left/i);  
    right = await screen.getByText(/right/i);  
    up = await screen.getByText(/up/i);  
    down = await screen.getByText(/down/i); 
    reset = await screen.getByText(/reset/i); 
    submit = await screen.getByRole('button', { name: "Submit" });
  
    expect(coordinates).toBeInTheDocument();
    expect(steps).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(left).toBeInTheDocument();
    expect(right).toBeInTheDocument();
    expect(up).toBeInTheDocument();
    expect(down).toBeInTheDocument();
    expect(reset).toBeInTheDocument();
    expect(submit).toBeInTheDocument();  
  })

  test('[3] reset button resets state and UI', async () => {
    render(<AppFunctional />);

    let initialSteps, initialMessage
  
     initialSteps = screen.getByText(/0 times/i);
     initialMessage = screen.getByRole('heading', { level: 3, name: "" });
  
     reset = await screen.getByText(/reset/i);
     await userEvent.click(reset);
  
      expect(initialMessage).toBeInTheDocument
      expect(initialSteps).toBeInTheDocument
    
  });
  
  test('[4] left button move functionality (basic)', async () => {
    render(<AppFunctional />);
    user = userEvent.setup()

    left = await screen.getByText(/left/i);
    await user.click(left);
  
    expect(await screen.findByText(/Coordinates \(1, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/1 time/i)).toBeInTheDocument();
  });

  test('[5] Submit button with empty email (basic)', async () => {
    render(<AppFunctional />);
    user = userEvent.setup()

    submit = await screen.getByRole('button', { name: "Submit" });
    await user.click(submit);
  
    expect(await screen.findByText(/Ouch: email is required/i)).toBeInTheDocument();
  });

 })





