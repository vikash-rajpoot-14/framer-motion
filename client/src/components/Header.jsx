import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';
import { motion } from "framer-motion";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      console.log("data", data);
      console.log(currentUser)
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
      console.log(currentUser)
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
    navigate("/signin")
  }
  const headervariant = {
    hidden: {
      y: -150,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.2, duration: 0.5, type: 'spring', stiffness: 120 }
    }
  }

  const linkvariant = {
    hidden: {
      y: -150,
      opacity: 0,
      scale: 2
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { delay: 0.2, duration: 0.5, type: 'spring', stiffness: 120 }
    }
  }
  return (
    <motion.header
      className='bg-slate-200 shadow-md sticky top-0'>
      <motion.div
      //parent variant 
        variants={headervariant}
        initial="hidden"
        animate="visible"
        className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <motion.h1
            variants={linkvariant}
            className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Purezza</span>
            <span className='text-slate-700'>Technologies</span>
          </motion.h1>
        </Link>
        <ul className='flex gap-4'>
          {currentUser &&
            <img
              className='rounded-full h-7 w-7 object-cover'
              src={currentUser.avatar}
              alt='profile'
            />
          }
          {currentUser ? <li onClick={handleSignOut} className='hover:cursor-pointer text-slate-700 hover:underline'> Sign Out</li> : (
            <motion.div
            //child variant no need to define initial and animate inherit from parent
              variants={linkvariant}

              className='flex gap-8'>
              <Link to='/signup'>
                <motion.li
                  className='hidden sm:inline text-slate-700 '>
                  Sign Up
                </motion.li>
              </Link>
              <Link to='/signin'>
                <motion.li
                  className='hidden sm:inline text-slate-700 '>
                  Sign In
                </motion.li>
              </Link>
            </motion.div>
          )}
        </ul>
      </motion.div>
    </motion.header>
  );
}
