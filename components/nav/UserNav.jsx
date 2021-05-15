import Link from 'next/link';

const UserNav = () => (
  <nav>
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link href="/user/history" className="nav-link">
          History
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/user/password" className="nav-link">
          Password
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/user/wishlist" className="nav-link">
          Wishlist
        </Link>
      </li>
    </ul>
  </nav>
);

export default UserNav;
