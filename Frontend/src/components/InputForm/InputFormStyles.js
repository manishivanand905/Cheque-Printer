import styled from "styled-components";

export const AppShell = styled.div`
  min-height: 100vh;
  padding: 32px 20px 40px;
  color: #f4efe6;
  background:
    radial-gradient(circle at top left, rgba(224, 182, 98, 0.14), transparent 28%),
    radial-gradient(circle at bottom right, rgba(36, 103, 174, 0.2), transparent 24%),
    linear-gradient(135deg, #0f1117 0%, #171b24 48%, #10141d 100%);
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  width: min(1180px, 100%);
  margin: 0 auto 28px;
  padding: 22px 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(10, 13, 19, 0.74);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(18px);
`;

export const LogoMark = styled.div`
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  font-size: 28px;
  background: linear-gradient(135deg, #f1c96b 0%, #d98d2b 100%);
  color: #1b1305;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
`;

export const HeaderTitle = styled.div`
  h1 {
    margin: 0;
    font-size: clamp(1.6rem, 2vw, 2.25rem);
    line-height: 1.1;
    color: #fff8ea;
  }

  p {
    margin: 6px 0 0;
    color: rgba(244, 239, 230, 0.72);
    font-size: 0.95rem;
    letter-spacing: 0.03em;
  }
`;

export const MainLayout = styled.main`
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
  width: min(1180px, 100%);
  margin: 0 auto;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const panelSurface = `
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background: rgba(11, 14, 20, 0.76);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(18px);
`;

export const FormPanel = styled.section`
  ${panelSurface}
  padding: 18px;
`;

export const PreviewPanel = styled.section`
  ${panelSurface}
  padding: 20px;
  overflow: hidden;
`;

export const PreviewTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 1rem;
  font-weight: 700;
  color: #fff6dc;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const PreviewBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 28px 20px;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02)),
    repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.012),
      rgba(255, 255, 255, 0.012) 12px,
      transparent 12px,
      transparent 24px
    );
`;

export const AmountWordsBadge = styled.div`
  max-width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(241, 201, 107, 0.28);
  border-radius: 14px;
  background: rgba(241, 201, 107, 0.08);
  color: #f8e7bc;
  font-size: 0.92rem;
  text-align: center;
  line-height: 1.5;
`;

export const SectionLabel = styled.h3`
  margin: 0 0 10px;
  font-size: 0.74rem;
  font-weight: 800;
  color: #f6d994;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  font-size: 0.83rem;
  font-weight: 600;
  color: #f7f0e4;
`;

const controlBase = `
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff9ef;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;

  &:focus {
    outline: none;
    border-color: rgba(241, 201, 107, 0.85);
    box-shadow: 0 0 0 4px rgba(241, 201, 107, 0.14);
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const Input = styled.input`
  ${controlBase}
  padding: 10px 12px;
  font-size: 0.9rem;

  &[type="date"] {
    color-scheme: dark;
  }
`;

export const TextArea = styled.textarea`
  ${controlBase}
  min-height: 110px;
  padding: 10px 12px;
  font-size: 0.9rem;
  resize: vertical;
`;

export const BankGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 16px;

  @media (max-width: 520px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const BankButton = styled.button`
  padding: 9px 8px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(241, 201, 107, 0.9)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 12px;
  background:
    ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, rgba(241, 201, 107, 0.22), rgba(217, 141, 43, 0.16))"
        : "rgba(255, 255, 255, 0.04)"};
  color: ${({ $active }) => ($active ? "#fff7e2" : "#ebe4d6")};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(241, 201, 107, 0.5);
  }
`;

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: #efe5d1;
  font-size: 0.86rem;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: #f1c96b;
  }
`;

export const FileInputLabel = styled.label`
  ${controlBase}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 10px 12px;
  font-size: 0.86rem;
  font-weight: 600;
  color: #f8f0df;
  cursor: pointer;
  text-align: center;

  input {
    display: none;
  }
`;

export const PrintButton = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 11px 14px;
  border: none;
  border-radius: 13px;
  background: linear-gradient(135deg, #f1c96b 0%, #d98d2b 100%);
  color: #1c1407;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 16px 26px rgba(217, 141, 43, 0.24);
  transition: transform 140ms ease, box-shadow 140ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 20px 30px rgba(217, 141, 43, 0.28);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 8px;
`;

export const SecondaryButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(241, 201, 107, 0.4);
  border-radius: 12px;
  background: rgba(241, 201, 107, 0.08);
  color: #f8e7bc;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(241, 201, 107, 0.7);
    background: rgba(241, 201, 107, 0.13);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`;

export const GhostButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  color: #efe5d1;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`;

export const FieldHint = styled.p`
  margin: -2px 0 0;
  color: rgba(244, 239, 230, 0.58);
  font-size: 0.73rem;
  line-height: 1.35;
`;

export const Disclaimer = styled.p`
  margin: 10px 0 0;
  color: rgba(244, 239, 230, 0.68);
  font-size: 0.76rem;
  line-height: 1.4;
`;
