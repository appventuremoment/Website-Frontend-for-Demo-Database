export function checkValidEmail(input) {return /^[^\s@]+@[^\s@]+$/.test(input)}
export function checkValidUserLength(input) {return /^.{3,40}$/.test(input)}
export function checkValidPassword(input) {return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(input)} 