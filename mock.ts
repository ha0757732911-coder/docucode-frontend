export const sampleCode = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


def is_prime(num):
    if num < 2:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True


class Calculator:
    def __init__(self):
        self.result = 0

    def add(self, x, y):
        return x + y
`;

export const documentedCode = `def fibonacci(n):
    """Compute the nth Fibonacci number recursively.

    Args:
        n (int): Position in the Fibonacci sequence.

    Returns:
        int: The nth Fibonacci number.
    """
    # Base case: 0 and 1 return themselves
    if n <= 1:
        return n
    # Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2)


def is_prime(num):
    """Check whether a given integer is a prime number.

    Args:
        num (int): The integer to test.

    Returns:
        bool: True if num is prime, otherwise False.
    """
    if num < 2:
        return False
    # Only need to test up to sqrt(num)
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True


class Calculator:
    """A simple calculator utility."""

    def __init__(self):
        """Initialize the calculator with a zeroed result."""
        self.result = 0

    def add(self, x, y):
        """Return the sum of two numbers."""
        return x + y
`;

export type HistoryItem = {
  id: string;
  fileName: string;
  date: string;
  preview: string;
};

export const mockHistory: HistoryItem[] = [
  { id: "1", fileName: "fibonacci.py", date: "2026-05-08 14:32", preview: "def fibonacci(n):\n    if n <= 1:" },
  { id: "2", fileName: "auth_utils.py", date: "2026-05-07 09:11", preview: "def hash_password(pw):\n    return bcrypt.hash(pw)" },
  { id: "3", fileName: "data_loader.py", date: "2026-05-05 18:45", preview: "import pandas as pd\ndef load_csv(path):" },
  { id: "4", fileName: "api_client.py", date: "2026-05-02 11:20", preview: "class ApiClient:\n    def __init__(self, key):" },
];

export const mockUsers = [
  { email: "alice@example.com", status: "Active", role: "User" },
  { email: "bob@example.com", status: "Active", role: "Admin" },
  { email: "carol@example.com", status: "Inactive", role: "User" },
  { email: "dave@example.com", status: "Active", role: "User" },
  { email: "eve@example.com", status: "Active", role: "User" },
];

// naive Python token highlighter for display only
const KW = ["def","return","if","else","elif","for","in","class","import","from","True","False","None","and","or","not","while","try","except","with","as","lambda","self"];
export function highlightPython(code: string): string {
  const esc = code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  return esc
    .replace(/("""[\s\S]*?"""|'''[\s\S]*?''')/g,'<span class="tok-com">$1</span>')
    .replace(/(#.*)/g,'<span class="tok-com">$1</span>')
    .replace(/("[^"\n]*"|'[^'\n]*')/g,'<span class="tok-str">$1</span>')
    .replace(/\b(\d+)\b/g,'<span class="tok-num">$1</span>')
    .replace(new RegExp(`\\b(${KW.join("|")})\\b`,"g"),'<span class="tok-kw">$1</span>')
    .replace(/\b([A-Za-z_]\w*)(?=\()/g,'<span class="tok-fn">$1</span>');
}
